import flask
from flask_restful import Api, Resource
from app.models.user import User, generate_access_token
from app.utils.misc import resp
from app import auth
from config import FAILED_LOGIN_LIMIT
from webargs.flaskparser import use_args
from webargs import fields, validate


mod = flask.Blueprint('user', __name__)
api = Api(mod, prefix='/api')


class AuthResource(Resource):
    def post(self):
        auth_header = flask.request.authorization

        if not auth_header:
            return resp(False, msg='Bad authentication header')

        user = User.find_by_email(auth_header['username'])

        if not user:
            return resp(False, msg='Invalid credentials')

        if user['failed_login_attempts'] >= FAILED_LOGIN_LIMIT:
            return resp(False, msg='This account is locked due to too many login attempts. Please reach out to us!')

        if not user.check_password(auth_header['password']):
            user['failed_login_attempts'] += 1
            user.save()
            return resp(False, msg='Invalid credentials')

        user['failed_login_attempts'] = 0
        user.save()
        token = generate_access_token(user)

        return resp(True, {'token': token})


class UserPasswordResource(Resource):
    @use_args({
        'current_password': fields.Str(
            required=True,
            location='json'
        ),
        'new_password': fields.Str(
            required=True,
            location='json'
        ),
        'new_password2': fields.Str(
            required=True,
            location='json'
        )
    })
    @auth.login_required
    def post(self, args):
        user = flask.g.current_user
        success, msg = user.change_password(**args)

        if success:
            return resp(True, data=msg)

        return resp(False, msg=msg)


class EmailVerificationResource(Resource):
    @use_args({
        'email': fields.Str(required=True, location='json'),
        'token': fields.Str(required=True, location='json')
    })
    def post(self, args):
        success, msg = User.verify_email(**args)
        return resp(False, msg=msg)


class ResetPasswordResource(Resource):
    @use_args({
        'email': fields.Str(
            required=True,
            validate=validate.Email('Invalid data'),
            location='query'),
    })
    def get(self, args):
        email = args['email']
        success = User.reset_password(email)
        if success:
            msg = 'Please check your email for password reset instructions.'
            return resp(True, msg=msg)

        return resp(False, msg='No user is associated with this email address.')


    @use_args({
        'password': fields.Str(required=True, validate=validate.Length(min=8), location='json'),
        'password2': fields.Str(required=True, location='json'),
        'token': fields.Str(required=True, location='json'),
    })
    def post(self, args):
        success, item = User.submit_reset_password(args)
        return resp(success, msg=item)


class UserResource(Resource):
    @auth.login_required
    def get(self):
        user = flask.g.current_user
        return resp(True, {'user': user})

    @use_args({
        'email': fields.Str(required=True, validate=validate.Email('address is not valid.'), location='json'),
        'password': fields.Str(required=True, validate=validate.Length(min=8), location='json')
    })
    def post(self, args):
        success, item = User.new_user(args)

        if not success:
            return resp(False, msg=item)
        else:
            return resp(True, {'user': item, 'token': generate_access_token(item)})


api.add_resource(ResetPasswordResource, '/auth/reset', endpoint='password_reset')
api.add_resource(AuthResource, '/auth/login', endpoint='login')
api.add_resource(UserResource, '/user', endpoint='user')
api.add_resource(EmailVerificationResource, '/user/verify-email', endpoint='verify_email')
api.add_resource(UserPasswordResource, '/user/password', endpoint='password')
