import React, {Component} from 'react';
import {Notification} from '../containers/Notification';


export default class LoggedOut extends Component {
    componentWillMount() {
        if (this.props.message) {
            this.props.showNotification(this.props.message);
        }

        this.checkAuthorized(this.props);
    }

    componentWillUpdate(nextProps) {
        this.checkAuthorized(nextProps);
    }

    checkAuthorized = (props) => {
        if (!props.authenticated) {
            return;
        }
        const {state} = props.location;
        const nextLoc = (state && state.nextPathname)?state.nextPathname:'/';
        this.context.router.replace({pathname: nextLoc, state: {nextPathname: null}});
    };

    render() {
        return (
            <div id="landing-content" className="col-xs-12">
                {this.props.children}
                <Notification />
            </div>
        );
    }
}

LoggedOut.contextTypes = {
    router: React.PropTypes.object.isRequired
};
