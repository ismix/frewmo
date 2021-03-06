import Axios from "axios";
import {setLoadingSpinner, setNotificationMessage} from "./app";

export const ACTION_LOGOUT = 'LOGOUT';
export const ACTION_AUTH = 'AUTH';
export const ACTION_USER_FETCHED = 'USER_FETCHED';

export const AUTH_STATE_NOT_AUTHENTICATED = 0;
export const AUTH_STATE_AUTHENTICATED = 1;

export const userFetched = (userData=null) => {
    return {type: ACTION_USER_FETCHED, user: userData?userData.user:{}};
};

export const logout = (userLoggedOut=true, msg="You have successfully logged out.") => {
    delete localStorage.authToken;
    return {type: ACTION_LOGOUT, msg: msg, userLoggedOut};
};

export const authenticated = (token=null) => {
    return {type: ACTION_AUTH, authState: AUTH_STATE_AUTHENTICATED, token: token};
};

export const fetchUser = () => {
    return authenticatedAction({
        path: "/api/user",
        successAction: userFetched,
        errorAction: console.log
    });
};

export const updateUserPassword = (currentPassword, newPassword, newPassword2) => {
    return authenticatedAction({
        path: '/api/user/password',
        method: 'post',
        payload: {
            'current_password': currentPassword,
            'new_password': newPassword,
            'new_password2': newPassword2
        }
    });
};

export const register = (userData, updateFormState) => {
    return dispatch => {
        updateFormState(true, null);

        Axios('/api/user', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: userData
        }).then((res) => {
            const {success, data, msg} = res.data;
            if (success) {
                localStorage.authToken = data.token;
                dispatch(authenticated(data.token));
            } else {
                updateFormState(false, msg);
            }
        });
    }
};

export const login = (username, password, updateFormState) => {
    return dispatch => {
        updateFormState(true, null);
        Axios('/api/auth/login', {
            method: 'post',
            headers: {
                'Authorization': 'Basic '+btoa(username+":"+password),
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            const {success, data, msg} = res.data;
            if (success) {
                localStorage.authToken = data.token;
                dispatch(authenticated(data.token));
            } else {
                updateFormState(false, msg);
            }
        });
    }
};

export const authenticatedAction = (params) =>{
    return (dispatch, getState) => {
        const {token} = getState().auth;
        if (!token) {
            dispatch(logout(false, "Please login to view requested page."));
            return;
        }

        dispatch(setLoadingSpinner());

        if (params.startAction) {
            dispatch(params.startAction());
        }

        const method = params.method?params.method.toLowerCase():'get';
        var requestObj = {
            'method': method,
            'headers': {
                'Authorization': 'Token '+token,
                'Content-Type': 'application/json'
            }
        };

        requestObj[method=='get'?'params':'data'] = params.payload;

        return Axios(params.path, requestObj).then((res) => {
            dispatch(setLoadingSpinner(false));
            return res.data;
        }).then((resBody) => {
            if (resBody) {
                if (resBody.success) {
                    if (params.successAction) {
                        dispatch(params.successAction(resBody.data));
                    }
                } else if (params.errorAction) {
                    dispatch(params.errorAction(resBody));
                }

                if (resBody.msg) {
                    dispatch(setNotificationMessage(resBody.msg));
                }
            }
        }).catch((error) => {
            if (error.response && error.response.status == 401) {
                dispatch(logout(false, "Your session has expired"));
            } else {
                dispatch(setNotificationMessage("An error occured, please try again later."));
                dispatch(setLoadingSpinner(false));
                throw error;
            }
        });
    }
};