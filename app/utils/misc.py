from flask_restful import marshal
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature
import flask


def resp(success, data=None, msg=""):
    if not data:
        data = {}

    for k, v in data.items():
        if hasattr(v, 'marshal_fields'):
            data[k] = marshal(v, v.marshal_fields())

    return {'success': success, 'data': data, 'msg': msg}


def tokenize(payload, expires_in=3600):
    s = Serializer(flask.current_app.config['SECRET_KEY'], expires_in=expires_in)
    return s.dumps(payload).decode('ascii')


def detokenize(token, field=None):
    s = Serializer(flask.current_app.config['SECRET_KEY'])
    try:
        item = s.loads(token)
        return item.get(field,None) if field else item
    except BadSignature:
        return None
