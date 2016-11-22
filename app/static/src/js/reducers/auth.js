import {ACTION_AUTH,
    ACTION_LOGOUT,
    AUTH_STATE_AUTHENTICATED,
    AUTH_STATE_NOT_AUTHENTICATED,
    ACTION_USER_FETCHED
} from '../actions/auth';

const INITIAL_STATE = {
    user: null,
    token: localStorage.authToken,
    authState: localStorage.authToken?AUTH_STATE_AUTHENTICATED:AUTH_STATE_NOT_AUTHENTICATED,
    error: '',
    userLoggedOut: false
};

export default function auth(state = INITIAL_STATE, action={}) {
    switch (action.type) {
        case ACTION_LOGOUT:
            return {
                token: null,
                authState:AUTH_STATE_NOT_AUTHENTICATED,
                error:action.msg,
                userLoggedOut: action.userLoggedOut
            };
        case ACTION_AUTH:
            var newState = {...action};
            delete newState.type;
            return newState;
        case ACTION_USER_FETCHED:
            return {...state, user: action.user};
        default:
            return state;
  }
}