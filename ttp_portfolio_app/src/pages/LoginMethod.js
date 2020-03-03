import React from 'react';
import cookie from 'react-cookies'
import Info from './../info/info';

class LoginMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: cookie.load('username') ? true : false,
            username: cookie.load('username')
        }
    }

    submitAction = (info) => {
        let route = Object.keys(info).length === 2 ? "/login" : "/register";
        console.log(route);

        //Send to backend to validate credentials
        fetch(Info.backEndUrl + route, {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => await this.adjustState(res))
        .catch((err) => {
            console.log(err);
        })
    }

    adjustState = async (res) => {
        let json = await res.json();
        if (json.success) {
            this.props.userUpdateBasicInformation({
                username: json.username,
                email: json.email
            })
            this.props.userUpdateLoginStatus();
            //Make render run
            this.setState({
                loggedIn: this.props.loginStatus
            });

            cookie.save("username", json.username);
            cookie.save("userEmail", json.email);
        } else {
            alert("Failed. Try again!"); //TODO: Implement way to change this message based on login method used
        }
    }
}
export default LoginMethod;