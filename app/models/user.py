from app.utils.db import AppModel
from mogo import Field
from app import bcrypt
from app import auth
from flask_restful import fields
from app.utils.misc import detokenize, tokenize
from app.utils.validators import validate_password
from app.utils.mailer import send_with_user, SendgridEmailTemplates
from uuid import uuid4
import flask


def generate_access_token(user):
    payload = {'id': user.get_id(), 'password': str(user['password'][:6])}
    return tokenize(payload)


@auth.verify_token
def verify_access_token(token):
    token_data = detokenize(token)

    if not token_data:
        return False

    uid = token_data.get('id', None)
    password = token_data.get('password', None)

    if not (uid and password):
        return False

    user = User.load_by_id(uid)
    if not (user and str(user['password'][:6]) == password):
        return False

    flask.g.current_user = user
    return True


class User(AppModel):
    email = Field(str)
    password = Field(bytes)
    email_verification_token = Field(str)

    @property
    def fullname(self):
        return None

    @property
    def email_verified(self):
        return not self['email_verification_token']

    def marshal_fields(self):
        return {
            'email': fields.String,
            'uri': fields.Url('user.user')
        }

    @classmethod
    def new_user(cls, user_data):
        user_data['email'] = user_data['email'].lower()

        password_valid, error_msg = validate_password(user_data['password'])

        if not password_valid:
            return False, error_msg

        if cls.find_by_email(user_data['email']):
            return False, 'A user with this email address already exists'

        user_data['password'] = bcrypt.generate_password_hash(user_data['password'])
        email_verification_token = str(uuid4())
        user_data['email_verification_token'] = email_verification_token
        user = cls.create(**user_data)
        merge_tags = {'email_verification_token': email_verification_token, 'email': user_data['email']}
        send_with_user(SendgridEmailTemplates.TYPE_WELCOME, user, tags=merge_tags, check_verified=False)
        return True, user

    @classmethod
    def find_by_email(cls, email):
        return cls.find_one({'email': email})

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    @classmethod
    def reset_password(cls, email):
        user = cls.find_by_email(email)

        if not user:
            return False

        user['password_reset_token'] = str(uuid4())
        user.save()
        payload = {'id': user.get_id(), 'password_reset_token': user['password_reset_token']}
        reset_token = tokenize(payload, expires_in=86400)
        merge_tags = {'reset_token': reset_token, 'email': email}
        send_with_user(SendgridEmailTemplates.TYPE_PASSWORD_RESET, user, tags=merge_tags, check_verified=False)
        return True

    @classmethod
    def verify_email(cls, email, token):
        user = cls.find_by_email(email)
        if not user or user.get('email_verification_token', None) != token:
            return False, "Sorry, we couldn't verify your email address."

        del(user['email_verification_token'])
        user.save()
        return True, "Your email has been validated successfully."

    @classmethod
    def submit_reset_password(cls, password_data):
        token_data = detokenize(password_data['token'])

        if not token_data:
            return False, 'Password reset token is invalid or expired. Please request a new one.'

        uid = token_data.get('id', None)
        password_reset_token = token_data.get('password_reset_token', None)

        if not (uid and password_reset_token):
            return False, 'Password reset token is invalid or expired. Please request a new one.'

        user = cls.load_by_id(uid)
        if not (user and user.get('password_reset_token', None) == password_reset_token):
            return False, 'Password reset token is invalid or expired. Please request a new one.'

        password_valid, error_msg = validate_password(password_data['password'], password2=password_data['password2'])

        if not password_valid:
            return False, error_msg

        user['password'] = bcrypt.generate_password_hash(password_data['password'])
        del(user['password_reset_token'])
        user.save()

        return True, 'Password has been updated successfully'
