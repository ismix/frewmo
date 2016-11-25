import React from 'react';
import {connect} from 'react-redux';
import LoggedOut from '../components/LoggedOut';
import {AUTH_STATE_AUTHENTICATED} from '../actions/auth';
import {setNotificationMessage} from '../actions/app';

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.authState === AUTH_STATE_AUTHENTICATED,
        message: state.auth.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showNotification: (message) => {
            return dispatch(setNotificationMessage(message));
        }
    };
};

const LoggedOutWrapper = connect(mapStateToProps, mapDispatchToProps)(LoggedOut);

export default LoggedOutWrapper;