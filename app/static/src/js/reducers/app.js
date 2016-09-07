import {ACTION_LOADING_SPINNER, ACTION_NOTIFICATION_MESSAGE} from '../actions/app';

const INITIAL_STATE = {
    loading: false,
    notificationMessage: ''
};

export default function app(state = INITIAL_STATE, action={}) {
    switch (action.type) {
        case ACTION_LOADING_SPINNER:
            return {...state, loading: action.loading};
        case ACTION_NOTIFICATION_MESSAGE:
            return {...state, notificationMessage: action.message};
        default:
            return state;
    }
}