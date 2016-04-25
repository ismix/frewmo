import logging
from logging.handlers import RotatingFileHandler
import flask

LOG_FORMAT = "%(asctime)s | %(ip)s | %(user_id)s | %(pathname)s:%(lineno)d | %(funcName)s | %(levelname)s | %(message)s"


class ContextFilter(logging.Filter):
    def filter(self, record):
        record.ip = flask.request.remote_addr
        # record.user_id = flask.g.current_user.get_id()
        return True


def setup_logger(app):
    if app.config['DEBUG']:
        handler = logging.NullHandler()
        handler.setLevel(logging.DEBUG)
    else:
        handler = RotatingFileHandler(app.config['LOGGING_PATH'], maxBytes=10000, backupCount=1)
        handler.setLevel(logging.INFO)

    formatter = logging.Formatter(LOG_FORMAT)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.addFilter(ContextFilter())
