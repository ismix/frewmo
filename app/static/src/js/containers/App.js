import {connect} from 'react-redux';
import {LoginBox, RegisterBox, ForgotPasswordBox, VerifyEmailBox} from '../components/App';
import {login,
    register,
    logout,
    AUTH_STATE_AUTHENTICATED,
} from '../actions/auth';
import {setNotificationMessage} from '../actions/app';

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.authState === AUTH_STATE_AUTHENTICATED,
        message: state.auth.error
    };
};

const mapDispatchToLoginProps = (dispatch) => {
    return {
        onLogin: (username, password, updateFormState) => {
            return dispatch(login(username, password, updateFormState));
        },
        showNotification: (message) => {
            return dispatch(setNotificationMessage(message));
        }
    };
};

export const Login = connect(mapStateToProps, mapDispatchToLoginProps)(LoginBox);

const mapDispatchToRegisterProps = (dispatch) => {
    return {
        onRegister: (userData, updateFormState) => {
            return dispatch(register(userData, updateFormState));
        },
        showNotification: (message) => {
            return dispatch(setNotificationMessage(message));
        }
    };
};

export const Register = connect(mapStateToProps, mapDispatchToRegisterProps)(RegisterBox);

const mapDispatchToForgotPasswordProps = (dispatch) => {
    return {
        showNotification: (message) => {
            return dispatch(setNotificationMessage(message));
        }
    };
};

export const ForgotPassword = connect(mapStateToProps, mapDispatchToForgotPasswordProps)(ForgotPasswordBox);

const mapStateToVerifyEmailProps = (state) => {
    return {
        notificationMessage: state.app.notificationMessage
    };
};

const mapDispatchToVerifyEmailProps = (dispatch) => {
    return {
        showNotification: (message) => {
            return dispatch(setNotificationMessage(message));
        }
    };
};

export const VerifyEmail = connect(mapStateToVerifyEmailProps, mapDispatchToVerifyEmailProps)(VerifyEmailBox);