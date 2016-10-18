import React, {Component} from 'react';
import Snackbar from 'material-ui/Snackbar';

export class NotificationBox extends Component {
    constructor(props) {
        super(props);
        this.state = {open: !!props.message, message: props.message?props.message:''};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.message && nextProps.message !== this.props.message) {
            this.setState({open: true, message: nextProps.message});
            this.props.clearMessage();
        }
    }

    handleRequestClose = () => {
        this.setState({open: false});
    };

    render() {
        return (
            <Snackbar
                bodyStyle={{textAlign: 'center'}}
                open={this.state.open}
                message={this.state.message}
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose}
            />
        );
    }
}

