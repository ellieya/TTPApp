import React from 'react';
import Page from './Page';
import SignIn from './SignIn';

class Transactions extends Page {
    render() {
        if (this.props.appState.loggedIn) {
            return (
                <div className="transactions">
                    <h1>Transactions</h1>
                </div>
            )
        } else {
            return(
                <SignIn redirect="/transactions"/>
            )
        }
        
    }
}

export default Transactions;