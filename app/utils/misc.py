from flask_restful import marshal
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature
import flask


def _resp_helper(item):
    if hasattr(item, 'marshal_fields'):
        return marshal(item, item.marshal_fields())

    item_type = type(item)

    if item_type == str:
        return item

    if item_type == dict:
        for k, v in item.items():
            item[k] = _resp_helper(v)
        return item

    try:
        return [_resp_helper(i) for i in item]
    except TypeError:
        return item


def resp(success, data=None, msg=""):
    if not data:
        data = {}

    data_type = type(data)

    if data_type in [list, dict]:
        for k, v in data.items():
            data[k] = _resp_helper(v)

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
