import React from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Route, Router, browserHistory} from 'react-router';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import auth from './reducers/auth';
import {NotFound, VerifyEmail} from './components/App';
import {ProtectedAppRoutes, Login, Register, ForgotPassword} from './containers/App';
import Home from './components/Home';

let store = createStore(combineReducers({auth}), applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/'>
                <Route path="login" component={Login} />
                <Route path="register" component={Register} />
                <Route path="password-reset" component={ForgotPassword} />
                <Route path="verify-email" component={VerifyEmail} />
                <Route component={ProtectedAppRoutes}>
                    <IndexRoute component={Home} />
                </Route>
                <Route path="*" component={NotFound} />
            </Route>
        </Router>
    </Provider>
, document.getElementById('reactMain'));