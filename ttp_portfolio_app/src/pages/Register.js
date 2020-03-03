import React from 'react';
import Form from './../component/Form';
import LoginMethod from './LoginMethod';
import {Redirect} from "react-router-dom";
import { connect } from "react-redux";
import { userUpdateBasicInformation, userUpdateLoginStatus } from './../redux/actions';

class Register extends LoginMethod {
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

const mapStateToProps = state => {
    return state.user;
}

export default connect (
    mapStateToProps,
    { userUpdateBasicInformation,
        userUpdateLoginStatus
     }
)(Register);