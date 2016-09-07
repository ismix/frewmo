export const ACTION_LOADING_SPINNER = 'LOADING_SPINNER';
export const ACTION_NOTIFICATION_MESSAGE = 'NOTIFICATION_MESSAGE';

export const setLoadingSpinner = (loading=true) => {
    return {type: ACTION_LOADING_SPINNER, loading};
};

export const setNotificationMessage = (message='') => {
    return {type: ACTION_NOTIFICATION_MESSAGE, message};
};