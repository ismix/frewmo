MINIMUM_PASSWORD_LENGTH = 8


def validate_password(password, password2=None):
    if len(password) < MINIMUM_PASSWORD_LENGTH:
        return False, 'Your password should be at least {length} characters'.format(length=MINIMUM_PASSWORD_LENGTH)

    if password2 and password != password2:
        return False, 'Passwords you have entered do not match'

    if password.strip() != password:
        return False, 'Password can not start or end with a space'

    return True, 'OK'
