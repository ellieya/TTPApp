import React from 'react';
import Form from './../component/Form';
import Info from './../info/info';
import Page from './Page';
import {Redirect} from "react-router-dom";
import cookie from 'react-cookies'


//Given allotted time, we should merge Register & Sign-in to a parent class, function is almost identical
class Register extends Page {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: cookie.load('username') ? true : false,
            username: cookie.load('username')
        }
    }

    submitAction = (info) => {
        //Send to backend to check if valid new user
        fetch(Info.backEndUrl + "/register", {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => { //On success, adjust this state and application state so that we refresh and display new information.
            let json = await res.json();
            if (json.success) {
                this.adjustAppState({
                    loggedIn: true,
                    username: json.username
                });
                this.setState({
                    loggedIn: true
                })
                cookie.save("username", json.username);
            } else {
                alert("E-mail address already in use. Try again!");
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/" />
        } else {
            //Explicitly set fields for this page
            let fields = [];
            fields.push({ desc: "Name" });
            fields.push({ desc: "E-mail" });
            fields.push({ desc: "Password", type: "password" })

            return (
                <div className="register">
                    <Form
                        title="Sign Up"
                        fields={fields}
                        action={this.submitAction}
                        class="login"
                    />
                </div>
            )
        }
    }
}

export default Register;