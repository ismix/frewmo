import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {Notification} from '../containers/Notification';
import RaisedButton from 'material-ui/RaisedButton';


export class Home extends Component {
    componentWillMount() {
        this.checkAuthorized(this.props);
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

Home.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export const LoadingBox = () => {
    return (
        <div className="loading-box">
            <div className="spinner center-xs">
                <CircularProgress size={2} />
            </div>
        </div>
    );
};