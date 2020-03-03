import React from 'react';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { userUpdateLoginStatus, userUpdateLogout} from './../redux/actions';

class NavigationLogin extends React.Component {
    render() {
        console.log("Calling from Navigation Login");
        console.log(this.props);
        return (<div className="user-logged-in">
            <span>Welcome, {this.props.username}!</span>
            <button onClick={() => {
                this.props.userUpdateLoginStatus();
                cookie.remove('username');
                cookie.remove('userEmail');
            }}>Log out</button>
        </div>)
    }
}

const mapStateToProps = state => {
    return state.user.info ? state.user.info : {};
}

export default connect(mapStateToProps, {
    userUpdateLoginStatus
})(NavigationLogin);