from flask import Flask, render_template, make_response, jsonify
from flask_restful import abort
from flask_bcrypt import Bcrypt
import mogo
from .utils.logger import setup_logger
from .utils.misc import resp
from flask_httpauth import HTTPTokenAuth
from webargs.flaskparser import parser


app = Flask(__name__)
app.config.from_object('config')
bcrypt = Bcrypt(app)
mogo.connect(app.config['DB_NAME'])
setup_logger(app)
auth = HTTPTokenAuth(scheme='Token')


@app.route('/')
@app.route('/<path:path>')
def main(path=None):
    return render_template('main.html')


@parser.error_handler
def handle_parser_error(error):
    k, v = list(error.messages.items())[0]
    response = resp(False, msg="%s: %s" % (k.capitalize(), v[0].capitalize()))
    abort(make_response(jsonify(response), 200))


@auth.error_handler
def handle_auth_error():
    abort(401)

from .resources.user import mod as user_mod
app.register_blueprint(user_mod)
