import React from 'react';
import Form from './../component/Form';
import Info from './../info/info';
import Page from './Page';
import {Redirect} from "react-router-dom";
import cookie from 'react-cookies'

class SignIn extends Page {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: cookie.load('username') ? true : false
        }
    }

    submitAction = (info) => {
        //Send to backend to validate credentials
        fetch(Info.backEndUrl + "/login", {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            let json = await res.json();
            if (json.success) {
                //Update current state, then update application state
                this.adjustAppState({
                    loggedIn: true,
                    username: json.username
                });
                this.setState({
                    loggedIn: true
                })
                cookie.save("username", json.username);
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
            fields.push({ desc: "E-mail" });
            fields.push({ desc: "Password", type: "password" })

            return (
                <div className="sign-in">
                    <Form
                        title="Sign In"
                        fields={fields}
                        action={this.submitAction}
                    />
                </div>
            )
        }
    }
}

export default SignIn;