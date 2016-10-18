import {connect} from 'react-redux';
import {NotificationBox} from '../components/Notification';
import {setNotificationMessage} from '../actions/app';


const mapStateToNotificationProps = (state) => {
    return {
        message: state.app.notificationMessage
    };
};

const mapDispatchToNotificationProps = (dispatch) => {
    return {
        clearMessage: () => {
            return dispatch(setNotificationMessage());
        }
    };
};

export const Notification = connect(mapStateToNotificationProps, mapDispatchToNotificationProps)(NotificationBox);
