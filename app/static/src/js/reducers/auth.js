import {ACTION_AUTH,
    ACTION_LOGOUT,
    AUTH_STATE_AUTHENTICATED,
    AUTH_STATE_NOT_AUTHENTICATED} from '../actions/auth';

const INITIAL_STATE = {
    token: localStorage.authToken,
    authState: localStorage.authToken?AUTH_STATE_AUTHENTICATED:AUTH_STATE_NOT_AUTHENTICATED,
    error: ''
};

export default function auth(state = INITIAL_STATE, action={}) {
    switch (action.type) {
        case ACTION_LOGOUT:
            return {token: null, authState:AUTH_STATE_NOT_AUTHENTICATED, error:action.msg};
        case ACTION_AUTH:
            var newState = {...action};
            delete newState.type;
            return newState;
        default:
            return state;
  }
}