import flask
from flask_restful import Api, Resource
from app.models.user import User, generate_access_token
from app.utils.misc import resp
from app import auth
from webargs.flaskparser import use_args
from webargs import fields, validate


mod = flask.Blueprint('user', __name__)
api = Api(mod, prefix='/api')


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
        'email': fields.Str(required=True, validate=validate.Email('Invalid data'), location='query'),
    })
    def get(self, args):
        email = args['email']
        success = User.reset_password(email)
        if success:
            return resp(True, msg='Please check your email for password reset instructions.')

        return resp(False, msg='No user is associated with this email address.')


    @use_args({
        'password': fields.Str(required=True, validate=validate.Length(min=8), location='json'),
        'password2': fields.Str(required=True, location='json'),
        'token': fields.Str(required=True, location='json'),
    })
    def post(self, args):
        success, item = User.submit_reset_password(args)
        return resp(success, msg=item)


class AuthResource(Resource):
    def post(self):
        auth_header = flask.request.authorization

        if not auth_header:
            return resp(False, msg='Bad authentication header')

        user = User.find_by_email(auth_header['username'])
        if not (user and user.check_password(auth_header['password'])):
            return resp(False, msg='Invalid credentials')

        token = generate_access_token(user)

        return resp(True, {'token': token})


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
