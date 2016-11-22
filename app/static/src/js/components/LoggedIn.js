import React, {Component} from 'react';
import {Notification} from '../containers/Notification';
import RaisedButton from 'material-ui/RaisedButton';
import {LoadingBox} from './App';

export class LoggedIn extends Component {
    componentWillMount() {
        this.checkAuthorized(this.props, () => {
            if (!this.props.user) {
                this.props.loadUser();
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.checkAuthorized(nextProps);
    }

    checkAuthorized = (props, successCallback=null) => {
        if (!props.authenticated) {
            const {location} = props;
            this.context.router.replace({
                pathname: '/login',
                state: {nextPathname: props.userLoggedOut?null:location.pathname, nextSearch: location.search}
            });
        } else if (successCallback) {
            successCallback();
        }
    };

    render() {
        return (
            <div id="login-content">
                <RaisedButton onClick={this.props.logout} label="Logout" />
                <div>{this.props.children}</div>
                {this.props.loading && <LoadingBox />}
                <Notification />
            </div>
        );
    }
}

LoggedIn.contextTypes = {
    router: React.PropTypes.object.isRequired
};