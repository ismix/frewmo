import req from 'superagent'

export const ACTION_LOGOUT = 'LOGOUT';
export const ACTION_AUTH = 'AUTH';

export const AUTH_STATE_NOT_AUTHENTICATED = 0;
export const AUTH_STATE_AUTHENTICATED = 1;


export const logout = (msg="You have successfully logged out.") => {
    delete localStorage.authToken;
    return {type: ACTION_LOGOUT, msg: msg};
};

export const authenticated = (token=null) => {
    return {type: ACTION_AUTH, authState: AUTH_STATE_AUTHENTICATED, token: token};
};

export const register = (user_data, updateFormState) => {
    return dispatch => {
        updateFormState(true, null);

        req.post('/api/user')
            .send(user_data)
            .end(function(err,res) {
                if (res.body.success) {
                    localStorage.authToken = res.body.data.token;
                    dispatch(authenticated(res.body.data.token));
                } else {
                    updateFormState(false, res.body.msg);
                }
            });
    }
};

export const login = (username, password, updateFormState) => {
    return dispatch => {
        updateFormState(true, null);

        req.post('/api/auth/login')
            .set('Authorization', 'Basic '+btoa(username+":"+password))
            .end((err,res) => {
                if (res.body.success) {
                    localStorage.authToken = res.body.data.token;
                    dispatch(authenticated(res.body.data.token));
                } else {
                    updateFormState(false, res.body.msg);
                }
            });
    }
};

export const authenticatedAction = (params) =>{
    return (dispatch, getState) => {
        const {token} = getState().auth;
        if (!token) {
            dispatch(logout("Please login to view requested page."));
            return;
        }

        if (params.startAction) {
            dispatch(params.startAction());
        }

        const method = params.method?params.method.toLowerCase():'get';
        var reqBody = req["method"](params.path).set('Authorization', 'Token '+token);

        if (params.payload) {
            reqBody = reqBody[method==='get'?'query':'send'](params.payload);
        }

        reqBody.end((err, res) => {
            if (res.unauthorized) {
                dispatch(logout("Your session has expired"));
                return;
            }

            if (res.ok) {
                if (res.body.success) {
                    dispatch(params.successAction(res.body.data));
                } else {
                    dispatch(params.errorAction(res.body.msg));
                }
            }
        });
    }
};