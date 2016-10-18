import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import React from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Route, Router, useRouterHistory} from 'react-router';
import {createHistory} from 'history';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import auth from './reducers/auth';
import app from './reducers/app';
import {NotFound} from './components/App';
import {Login,
        Register,
        ForgotPassword,
        VerifyEmail} from './containers/App';
import {HomePage} from './containers/Home';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import '../css/index.sass';
import 'flexboxgrid';

let muiTheme = getMuiTheme();
let store = createStore(combineReducers({auth, app}), applyMiddleware(thunk));
const history = useRouterHistory(createHistory)({basename: '/'});

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={history}>
            <Route path='/'>
                <Route path="login" component={Login} />
                <Route path="register" component={Register} />
                <Route path="password-reset" component={ForgotPassword} />
                <Route path="verify-email" component={VerifyEmail} />
                <IndexRoute component={HomePage} />
                <Route path="*" component={NotFound} />
            </Route>
        </Router>
        </MuiThemeProvider>
    </Provider>
, document.getElementById('reactMain'));
