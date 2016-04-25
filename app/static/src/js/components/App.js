import React, {Component} from "react";
import {Link} from "react-router";
import req from 'superagent';

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
        var username = this.email.value;
        var password = this.password.value;
        this.props.onLogin(username, password, this.updateFormState);
    };

    render() {
        return (
            <div>
                <label htmlFor="email">Email:</label>
                <input disabled={this.state.disabled} ref={(node) => {this.email = node}} id="email" type="text" />
                <label htmlFor="password">Password: </label>
                <input disabled={this.state.disabled} ref={(node) => {this.password = node}} id="password" type="password" />
                <button disabled={this.state.disabled} onClick={this.onSubmit}>Login</button>
                {this.state.message && <NotificationBox message={this.state.message} />}
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
        const email = this.email.value;
        const password = this.password.value;
        this.props.onRegister({email, password}, this.updateFormState);
    };

    render() {
        return (
            <div>
                <label htmlFor="email">Email:</label>
                <input disabled={this.state.disabled} ref={(node) => {this.email = node}} id="email" type="text" />
                <label htmlFor="password">Password:</label>
                <input disabled={this.state.disabled} ref={(node) => {this.password = node}} id="password" type="password" />
                <button disabled={this.state.disabled} onClick={this.onSubmit}>Register</button>
                {this.state.message && <NotificationBox message={this.state.message} />}
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
            .query({email: this.email.value})
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
                password: this.password.value,
                password2: this.password2.value,
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
                <div>
                    {!this.state.submitted && (
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input disabled={this.state.disabled} ref={(node) => {this.email = node}} id="email" type="text" />
                            <button disabled={this.state.disabled} onClick={this.onPasswordResetRequest}>Submit</button>
                        </div>
                    )}
                    {this.state.message && <p>{this.state.message}</p>}
                </div>
            );
        }

        return (
            <div>
                {!this.state.submitted && (
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input disabled={this.state.disabled} ref={(node) => {this.password = node}} id="password" type="password" />
                        <label htmlFor="password2">Repeat Password: </label>
                        <input disabled={this.state.disabled} ref={(node) => {this.password2 = node}} id="password2" type="password" />
                        <button disabled={this.state.disabled} onClick={this.onPasswordReset}>Submit</button>
                    </div>
                )}
                {this.state.message && <NotificationBox message={this.state.message} />}
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
        return (<p>{this.state.message}</p>);
    }
}
