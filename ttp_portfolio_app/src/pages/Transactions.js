import React from 'react';
import Page from './Page';
import SignIn from './SignIn';
import Info from './../info/info';
import { connect } from "react-redux";
import { userUpdateTransactions } from './../redux/actions';

class Transactions extends React.Component {

    constructor(props) {
        super(props);
        this.loadingFlag = true; //Flag to prevent refreshData from running multiple times
    }

    async refreshData() {
        console.log("running refreshdata on trans");
        if (this.loadingFlag && this.props.user.info) {
            this.loadingFlag = false;
            await fetch(Info.backEndUrl + "/getAllTransaction", {
                method: "POST",
                body: JSON.stringify({
                    user: this.props.user.info.email
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then (async (res) => {
                let json = await res.json();
                this.props.userUpdateTransactions(json);
            })
        }
    }

    createTransactionsList = () => {
        let transactionsList = [];
        
        this.props.user.transactions.forEach( (element) => {
            transactionsList.push(
            <tbody>
                <tr>
                    <td>{element.timestamp}</td>
                    <td>{element.stock}</td>
                    <td>{element.type}</td>
                    <td>{element.pricePerStock}</td>                            
                    <td>{element.qty}</td>
                    <td>{element.totalCost}</td>
                </tr>
            </tbody>
            )}
        )
        return transactionsList;
    }

    render() {
        if (this.props.user.loginStatus) {
            this.refreshData();
            return (
                <div className="transactions">
                    <h1>Transactions</h1>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Stock</th>
                                <th>Transaction Type</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total Cost </th>
                            </tr>
                            </thead>
                            {this.props.user.transactions ? this.createTransactionsList() : ""}
                    </table>
                </div>
            )
        } else {
            return(
                <SignIn redirect="/transactions"/>
            )
        }
        
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {
    userUpdateTransactions
})(Transactions);