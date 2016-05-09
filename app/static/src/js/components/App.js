import React, {Component} from "react";
import {Link} from "react-router";
import req from 'superagent';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import 'flexboxgrid';

export const NotFound = () => {
    return (<h1>Not found!</h1>);
};

export const NotificationBox = (props) => {
    return (
        <div>
            <p>{props.message}</p>
        </div>
    );
};

export class ProtectedRoutes extends Component {
    componentDidMount() {
        this.checkAuthorized(this.props);
    }

    componentWillUpdate(nextProps) {
        this.checkAuthorized(nextProps);
    }

    checkAuthorized = (props) => {
        if (!props.authenticated) {
            this.context.router.replace({
                pathname: '/login',
                state: {nextPathname: props.location.pathname}
            });
        }
    };

    render() {
        return (<div>{this.props.children}</div>);
    }
}

ProtectedRoutes.contextTypes = {
    router: React.PropTypes.object.isRequired
};


export class LoginBox extends Component {
    constructor(props) {
        super(props);
        this.state = {disabled: false, message: null};
    }

    componentWillMount() {
        this.checkAuthorized(this.props);
    }

    componentWillUpdate(nextProps) {
        this.checkAuthorized(nextProps);
    }

    updateFormState = (disabled, message) => {
        this.setState({disabled, message});
    };

    checkAuthorized = (props) => {
        if (!props.authenticated) {
            return;
        }
        const {locationState} = props.location;
        const nextLoc = (locationState && locationState.nextPathname)?locationState.nextPathname:'/';
        this.context.router.replace(nextLoc);
    };

    onSubmit = () => {
        this.setState({message: null});
        var username = this.email.getValue();
        var password = this.password.getValue();
        this.props.onLogin(username, password, this.updateFormState);
    };

    render() {
        return (
            <div className="col-xs-12 center-xs">
                <div className="row center-xs">
                    <TextField floatingLabelText='Email' disabled={this.state.disabled} ref={(node) => {this.email = node}} />
                </div>
                <div className="row center-xs">
                    <TextField floatingLabelText='Password' disabled={this.state.disabled} ref={(node) => {this.password = node}} type="password" />
                </div>
                <br />
                <div className="row center-xs">
                    <RaisedButton label="Login" disabled={this.state.disabled} onClick={this.onSubmit} />
                </div>
                <div className="row center-xs">
                    {this.state.message && <NotificationBox message={this.state.message} />}
                </div>
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
        this.state = {disabled: false, message: null};
    }

    componentWillMount() {
        this.checkAuthorized(this.props);
    }

    componentWillUpdate(nextProps) {
        this.checkAuthorized(nextProps);
    }

    updateFormState = (disabled, message) => {
        this.setState({disabled, message});
    };

    checkAuthorized = (props) => {
        if (!props.authenticated) {
            return;
        }

        const {locationState} = props.location;
        const nextLoc = (locationState && locationState.nextPathname)?locationState.nextPathname:'/';
        this.context.router.replace(nextLoc);
    };

    onSubmit = () => {
        this.setState({message: null});
        const email = this.email.getValue();
        const password = this.password.getValue();
        this.props.onRegister({email, password}, this.updateFormState);
    };

    render() {
        return (
            <div className="col-xs-12 center-xs">
                <div className="row center-xs">
                    <TextField floatingLabelText='Email' disabled={this.state.disabled} ref={(node) => {this.email = node}} />
                </div>
                <div className="row center-xs">
                    <TextField floatingLabelText='Password' disabled={this.state.disabled} ref={(node) => {this.password = node}} type="password" />
                </div>
                <br />
                <div className="row center-xs">
                    <RaisedButton label="Register" disabled={this.state.disabled} onClick={this.onSubmit} />
                </div>
                <div className="row center-xs">
                    {this.state.message && <NotificationBox message={this.state.message} />}
                </div>
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
        this.state = {disabled: false, message: null, submitted: false};
    }
    componentWillMount() {
        this.checkAuthorized(this.props);
        this.token = this.props.location.query.token;
    }

    checkAuthorized = (props) => {
        if (props.authenticated) {
            this.context.router.replace('/');
        }
    };

    onPasswordResetRequest = () => {
        this.setState({disabled: true, message: null, submitted: false});

        req.get('/api/auth/reset')
            .query({email: this.email.getValue()})
            .end((err,res) => {
                if (res.body.success) {
                    this.setState({disabled: true, message: res.body.msg, submitted: true});
                } else {
                    this.setState({disabled: false, message: res.body.msg, submitted: false});
                }
            });
    };

    onPasswordReset = () => {
        this.setState({disabled: true, message: null, submitted: false});

        req.post('/api/auth/reset')
            .send({
                password: this.password.getValue(),
                password2: this.password2.getValue(),
                token: this.token
            })
            .end((err,res) => {
                if (res.body.success) {
                    this.setState({disabled: true, message: res.body.msg, submitted: true});
                } else {
                    this.setState({disabled: false, message: res.body.msg, submitted: false});
                }
            });
    };

    render() {
        if (!this.token){
            return (
                <div className="col-xs-12 center-xs">
                    {!this.state.submitted && (
                        <div>
                            <div className="row center-xs">
                                <TextField floatingLabelText='Email' disabled={this.state.disabled} ref={(node) => {this.email = node}} />
                            </div>
                            <div className="row center-xs">
                                <RaisedButton label="Submit" disabled={this.state.disabled} onClick={this.onPasswordResetRequest} />
                            </div>
                        </div>
                    )}
                    <div className="row center-xs">
                        {this.state.message && <NotificationBox message={this.state.message} />}
                    </div>
                </div>
            );
        }

        return (
            <div className="col-xs-12 center-xs">
                {!this.state.submitted && (
                    <div>
                        <div className="row center-xs">
                            <TextField floatingLabelText='Password' disabled={this.state.disabled} ref={(node) => {this.password = node}} type="password" />
                        </div>
                        <div className="row center-xs">
                            <TextField floatingLabelText='Repeat Password' disabled={this.state.disabled} ref={(node) => {this.password2 = node}} type="password" />
                        </div>
                        <div className="row center-xs">
                            <RaisedButton label="Submit" disabled={this.state.disabled} onClick={this.onPasswordReset} />
                        </div>
                    </div>
                )}
                <div className="row center-xs">
                    {this.state.message && <NotificationBox message={this.state.message} />}
                </div>
            </div>
        );
    }
}

ForgotPasswordBox.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {message: 'Checking your account', valid: true};
    }
    componentWillMount() {
        const email = this.props.location.query.email;
        const token = this.props.location.query.token;

        if (!(email && token)) {
            this.setState({valid: false});
            return;
        }

        req.post('/api/user/verify-email')
            .send({email, token})
            .end((err,res) => {
                this.setState({message: res.body.msg});
            });
    }

    render() {
        if (!this.state.valid) {
            return (<NotFound />);
        }
        return (
            <div className="col-xs-12 center-xs">
                <NotificationBox message="{this.state.message}" />
            </div>
        );
    }
}
