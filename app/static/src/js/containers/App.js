import {connect} from 'react-redux';
import {ProtectedRoutes, LoginBox, RegisterBox, ForgotPasswordBox} from '../components/App';
import {login,
    register,
    logout,
    AUTH_STATE_AUTHENTICATED,
} from '../actions/auth';

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.authState === AUTH_STATE_AUTHENTICATED
    };
};

export const ProtectedAppRoutes = connect(mapStateToProps)(ProtectedRoutes);

const mapDispatchToLoginProps = (dispatch) => {
    return {
        onLogin: (username, password, updateFormState) => {
            dispatch(login(username, password, updateFormState));
        }
    };
};

export const Login = connect(mapStateToProps, mapDispatchToLoginProps)(LoginBox);

const mapDispatchToRegisterProps = (dispatch) => {
    return {
        onRegister: (userData, updateFormState) => {
            dispatch(register(userData, updateFormState));
        }
    };
};

export const Register = connect(mapStateToProps, mapDispatchToRegisterProps)(RegisterBox);
export const ForgotPassword = connect(mapStateToProps)(ForgotPasswordBox);
