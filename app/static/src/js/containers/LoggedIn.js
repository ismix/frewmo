import {connect} from 'react-redux';
import {LoggedIn} from '../components/LoggedIn';
import {AUTH_STATE_AUTHENTICATED, logout, fetchUser} from '../actions/auth';

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        loading: state.app.loading,
        authenticated: state.auth.authState === AUTH_STATE_AUTHENTICATED,
        userLoggedOut: state.auth.userLoggedOut,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            return dispatch(logout());
        },
        loadUser: () => {
            return dispatch(fetchUser());
        }
    };
};

const LoggedInWrapper = connect(mapStateToProps, mapDispatchToProps)(LoggedIn);
export default LoggedInWrapper;