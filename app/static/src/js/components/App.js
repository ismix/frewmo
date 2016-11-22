import React, {Component} from "react";
import {Link} from "react-router";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Notification} from '../containers/Notification';
import Axios from "axios";
import 'flexboxgrid';

export const NotFound = () => {
    return (<h1>Not found!</h1>);
};

export class LoginBox extends Component {
    constructor(props) {
        super(props);
        this.state = {disabled: false};

        if (this.props.message) {
            this.props.showNotification(this.props.message);
        }
    }

    componentWillMount() {
        this.checkAuthorized(this.props);
    }

    componentWillUpdate(nextProps) {
        this.checkAuthorized(nextProps);
    }

    updateFormState = (disabled, message) => {
        this.setState({disabled, message});
        this.props.showNotification(message);
    };

    checkAuthorized = (props) => {
        if (!props.authenticated) {
            return;
        }
        const {state} = props.location;
        const nextLoc = (state && state.nextPathname)?state.nextPathname:'/';
        this.context.router.replace({pathname: nextLoc, state: {nextPathname: null}});
    };

    onSubmit = (e) => {
        e.preventDefault();
        var username = this.email.getValue();
        var password = this.password.getValue();
        this.props.onLogin(username, password, this.updateFormState);
    };

    render() {
        return (
            <div className="col-xs-12 center-xs">
                <form onSubmit={this.onSubmit}>
                <div className="row center-xs">
                    <TextField floatingLabelText='Email' disabled={this.state.disabled} ref={(node) => {this.email = node}} />
                </div>
                <div className="row center-xs">
                    <TextField floatingLabelText='Password' disabled={this.state.disabled} ref={(node) => {this.password = node}} type="password" />
                </div>
                <br />
                <div className="row center-xs">
                    <RaisedButton type="submit" label="Login" disabled={this.state.disabled} />
                </div>
                </form>
                <Notification />
            </div>
        );
    }
}

LoginBox.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export class RegisterBox extends Component {
    constructor(props) {
        super(props);
        this.state = {disabled: false};

        if (this.props.message) {
            this.props.showNotification(this.props.message);
        }
    }

    componentWillMount() {
        this.checkAuthorized(this.props);
    }

    componentWillUpdate(nextProps) {
        this.checkAuthorized(nextProps);
    }

    updateFormState = (disabled, message) => {
        this.setState({disabled, message});
        this.props.showNotification(message);
    };

    checkAuthorized = (props) => {
        if (!props.authenticated) {
            return;
        }

        const {state} = props.location;
        const nextLoc = (state && state.nextPathname)?state.nextPathname:'/';
        this.context.router.replace({pathname: nextLoc, state: {nextPathname: null}});
    };

    onSubmit = (e) => {
        e.preventDefault();
        const email = this.email.getValue();
        const password = this.password.getValue();
        this.props.onRegister({email, password}, this.updateFormState);
    };

    render() {
        return (
            <div className="col-xs-12 center-xs">
                <form onSubmit={this.onSubmit}>
                <div className="row center-xs">
                    <TextField floatingLabelText='Email' disabled={this.state.disabled} ref={(node) => {this.email = node}} />
                </div>
                <div className="row center-xs">
                    <TextField floatingLabelText='Password' disabled={this.state.disabled} ref={(node) => {this.password = node}} type="password" />
                </div>
                <br />
                <div className="row center-xs">
                    <RaisedButton label="Register" disabled={this.state.disabled} type="submit" />
                </div>
                </form>
                <Notification />
            </div>
        );
    }
}

RegisterBox.contextTypes = {
    router: React.PropTypes.object.isRequired
};


export class ForgotPasswordBox extends Component {
    constructor(props) {
        super(props);
        this.state = {disabled: false, submitted: false};

        if (this.props.message) {
            this.props.showNotification(this.props.message);
        }
    }
    componentWillMount() {
        this.checkAuthorized(this.props);
        this.token = this.props.location.query.token;
    }

    componentWillUpdate(nextProps) {
        this.checkAuthorized(nextProps);
        this.token = nextProps.location.query.token;
    }

    checkAuthorized = (props) => {
        if (!props.authenticated) {
            return;
        }

        const {state} = props.location;
        const nextLoc = (state && state.nextPathname)?state.nextPathname:'/';
        this.context.router.replace({pathname: nextLoc, state: {nextPathname: null}});
    };

    updateFormState = (disabled, message, submitted) => {
        this.setState({disabled, message, submitted});
        this.props.showNotification(message);
    };

    onPasswordResetRequest = (e) => {
        e.preventDefault();
        this.updateFormState(true, null, false);

        Axios('/api/auth/reset', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {email: this.email.getValue()}
        }).then((res) => {
            const {success, msg} = res.data;
            if (success) {
                this.updateFormState(true, msg, true);
            } else {
                this.updateFormState(false, msg, false);
            }
        });
    };

    onPasswordReset = (e) => {
        e.preventDefault();
        this.updateFormState(true, null, false);

        Axios('/api/auth/reset', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                password: this.password.getValue(),
                password2: this.password2.getValue(),
                token: this.token
            }
        }).then((res) => {
            const {success, msg} = res.data;
            if (success) {
                this.updateFormState(true, msg, true);
            } else {
                this.updateFormState(false, msg, false);
            }
        });
    };

    render() {
        if (!this.token){
            return (
                <div className="col-xs-12 center-xs">
                    {!this.state.submitted && (
                        <div>
                            <form onSubmit={this.onPasswordResetRequest}>
                            <div className="row center-xs">
                                <TextField floatingLabelText='Email' disabled={this.state.disabled} ref={(node) => {this.email = node}} />
                            </div>
                            <div className="row center-xs">
                                <RaisedButton label="Submit" type="submit" disabled={this.state.disabled} />
                            </div>
                            </form>
                        </div>
                    )}
                    <Notification />
                </div>
            );
        }

        return (
            <div className="col-xs-12 center-xs">
                {!this.state.submitted && (
                    <div>
                        <form onSubmit={this.onPasswordReset}>
                        <div className="row center-xs">
                            <TextField floatingLabelText='Password' disabled={this.state.disabled} ref={(node) => {this.password = node}} type="password" />
                        </div>
                        <div className="row center-xs">
                            <TextField floatingLabelText='Repeat Password' disabled={this.state.disabled} ref={(node) => {this.password2 = node}} type="password" />
                        </div>
                        <div className="row center-xs">
                            <RaisedButton label="Submit" disabled={this.state.disabled} type="submit" />
                        </div>
                        </form>
                    </div>
                )}
                <Notification />
            </div>
        );
    }
}

ForgotPasswordBox.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export class VerifyEmailBox extends Component {
    componentWillMount() {
        const email = this.props.location.query.email;
        const token = this.props.location.query.token;

        if (email && token) {
            Axios('/api/user/verify-email', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {email, token}
            }).then((res) => {
                this.props.showNotification(res.data.msg);
            });
        } else {
            this.props.showNotification('Email verification failed.');
        }
    }

    componentWillReceiveProps = (newProps) => {
        if (this.props.notificationMessage !== newProps.notificationMessage) {
            this.context.router.replace('/');
        }
    };

    render() {
        return (<div>Verifying your email address...</div>);
    }
}

VerifyEmailBox.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export const LoadingBox = () => {
    return (
        <div className="loading-box">
            <div className="spinner center-xs">
                <CircularProgress size={3} />
            </div>
        </div>
    );
};