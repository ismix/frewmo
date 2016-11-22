import {connect} from 'react-redux';
import {Home} from '../components/Home';
import {AUTH_STATE_AUTHENTICATED, logout, fetchUser} from '../actions/auth';

const mapStateToHomeProps = (state) => {
    return {
        user: state.auth.user,
        loading: state.app.loading,
        authenticated: state.auth.authState === AUTH_STATE_AUTHENTICATED,
        userLoggedOut: state.auth.userLoggedOut,
    };
};

const mapDispatchToHomeProps = (dispatch) => {
    return {
        logout: () => {
            return dispatch(logout());
        },
        loadUser: () => {
            return dispatch(fetchUser());
        }
    };
};

export const HomePage = connect(mapStateToHomeProps, mapDispatchToHomeProps)(Home);