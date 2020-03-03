import React from 'react';
import Form from './../component/Form';
import LoginMethod from './LoginMethod';
import {Redirect} from "react-router-dom";
import { connect } from "react-redux";
import { userUpdateBasicInformation, userUpdateLoginStatus } from './../redux/actions';

/**
 * Expected props:
 * redirect (optional) - Default redirect is to "/" but if a redirect is specified, will redirect to specified link instead.
 */

class SignIn extends LoginMethod {
    render() {
        console.log("From Sign-In");
        console.log(this.props.loginStatus);
        if (this.state.loggedIn) {
            return <Redirect to={this.props.redirect ? this.props.redirect : "/"} />
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
)(SignIn);