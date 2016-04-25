import sendgrid
import flask


class TemplateNotDefinedError(Exception):
    pass


class SendgridEmailTemplates:
    TYPE_WELCOME = ''
    TYPE_PASSWORD_RESET = ''


def send_internal_mail(template_name, merge_tags):
    to_addr = flask.current_app.config('SENDGRID_INTERNAL_TO_ADDRESS')
    from_addr = flask.current_app.config['SENDGRID_FROM_ADDRESS']
    _send_mail(template_name, to_addr, merge_tags=merge_tags, from_address=from_addr)


def send_with_user(template, user, tags, check_verified=True):
    if check_verified and not user.email_verified:
        return

    _send_mail(template, user.email, user.fullname, tags)


def _send_mail(template_id, rcv_address, rcv_name=None, merge_tags=None, from_address=None):
    if flask.current_app.config['MAIL_TEST_ENV']:
        return True

    if not template_id:
        raise TemplateNotDefinedError()

    conn = sendgrid.SendGridClient(flask.current_app.config['SENDGRID_API_KEY'])
    to_addr = "%s <%s>" % (rcv_name, rcv_address) if rcv_name else rcv_address
    message = sendgrid.Mail()
    message.add_to(to_addr)
    message.set_from(from_address if from_address else flask.current_app.config['SENDGRID_INTERNAL_FROM_ADDRESS'])
    message.set_html(" ")
    message.set_subject(" ")
    message.add_filter("templates", "enable", 1)
    message.add_filter("templates", "template_id", template_id)

    if merge_tags:
        merge_tags = {("*|%s|*" % k.upper()): [v] for k, v in merge_tags.items()}
        message.set_substitutions(merge_tags)

    status, message = conn.send(message)
    return (status / 100) == 2
