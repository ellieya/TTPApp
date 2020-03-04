import React from 'react';
import Page from './Page';
import SignIn from './SignIn';
import Form from './../component/Form';
import Info from './../info/info';
import StockResult from './../component/StockResult';
import { connect } from "react-redux";
import { userUpdateBalance, userUpdatePortfolio } from './../redux/actions';

class Portfolio extends Page {

    constructor(props) {
        super(props);
        this.loadingFlag = true; //Flag to prevent refreshData from running multiple times
        this.portfolioTotalValue = 0;
        this.state = {
            loading: true
        }
    }

    async componentDidMount() {
        await this.refreshData();
    }

    adjustPortfolioState = () => {
        this.loadingFlag = true;
        this.setState({
            loading: true
        })
    }

    async refreshData() {
        if (this.loadingFlag && this.props.user.info) {
            this.loadingFlag = false;

            let dataReceived = [];
            /**
             * 0 - cash balance
             * 1 - stocks owned
             */

            //Get cash balance from backend
            await fetch(Info.backEndUrl + "/getCash", {
                method: "POST",
                body: JSON.stringify({
                    user: this.props.user.info.email
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (res) => {
                    let json = await res.json();
                    dataReceived.push(json);
                })

            //Get all stocks owned from backend
            await fetch(Info.backEndUrl + "/getAllStock", {
                method: "POST",
                body: JSON.stringify({
                    user: this.props.user.info.email
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (res) => {
                    let json = await res.json();
                    json.forEach(async (element) => { //Calculate equity of each stock based on price of stock
                        console.log(Info.IEXUrl + "/stock/" + element["stock"] + "/quote?" + Info.IEXAPIKeyUrlParam);
                        element["pricePerStock"] = await fetch(Info.IEXUrl + "/stock/" + element["stock"] + "/quote?" + Info.IEXAPIKeyUrlParam)
                            .then(async (res) => {
                                let json = await res.json();
                                return Number.parseFloat(json.latestPrice).toFixed(2);
                            })
                        element["totalEquity"] = element["pricePerStock"] * element["qty"];
                        this.portfolioTotalValue += element["totalEquity"]; 
                    })
                    dataReceived.push(json);
                })


            //Update redux store
            this.props.userUpdateBalance(dataReceived[0]);
            this.props.userUpdatePortfolio(dataReceived[1]);

            //Fix loading state
            this.setState({
                loading: false
            })
        }

    }

    
    createOwnedStocksRows = () => {
        console.log("Create owned running");
        let stockList = [];
        this.props.user.portfolio.forEach((element) => {
            stockList.push(
                <tbody>
                    <tr>
                        <td>{element.stock}</td>
                        <td>{element.qty}</td>
                        <td>{element.pricePerStock}</td>
                        <td>{element.totalEquity}</td>
                        {/* <td>{this.ownedStockListPrices[i]}</td> */}
                        {/* <td>{ Number.parseFloat(this.ownedStockListPrices[i]) * Number.parseInt(element.qty)}</td> */}
                    </tr>
                </tbody>
            )
        })
        return stockList;
    }

    createSearchResultsList = () => {
        let results = [];
        try {
            this.state.searchResults.forEach((element) => {
                //For maximum compatability between two used APIs, only push results for US market
                if (element["4. region"] === "United States") {
                    results.push(
                        <StockResult ticker={element["1. symbol"]} name={element["2. name"]} action={this.adjustPortfolioState} key={element["1. symbol"]} />
                    )
                }
            })
        } catch (err) {
            alert("If you are getting this message, the API key has either expired or reached its limit. Please wait ~60 seconds, or wait until tomorrow. Thank you!")
        }
        return results;
    }

    submitAction = async (info) => {
        //Check that info AND ticker has value before firing
        if (info && info.Ticker) {
            console.log(Info.AVAPIUrl + "/query?function=SYMBOL_SEARCH&keywords=" + info.Ticker + Info.AVAPIKeyUrlParam);
            await fetch(Info.AVAPIUrl + "/query?function=SYMBOL_SEARCH&keywords=" + info.Ticker + Info.AVAPIKeyUrlParam)
                .then(async (res) => {
                    let searchResults = await res.json();
                    this.setState({
                        "searchResults": searchResults.bestMatches
                    })
                })
        }
        console.log(info);
    }

    render() {
        console.log("Portfolio");
        console.log(this.props);
        if (this.loadingFlag) {
            this.refreshData();
        }
        if (this.props.user.loginStatus) {
            return (
                <div className="portfolio">
                    <div className="portfolio-side">
                        <h1>Portfolio (${Number.parseFloat(this.portfolioTotalValue).toFixed(2)})</h1>
                        <button onClick={
                            () => {
                                this.forceUpdate()
                            }
                        }>Get Current Prices</button>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Stock</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total Value</th>
                                </tr>
                            </thead>
                            {this.props.user.portfolio ? this.createOwnedStocksRows() : ""}
                        </table>
                    </div>
                    <div className="transaction-side">
                        <Form
                            title="Search & Buy"
                            fields={[
                                {
                                    desc: "Ticker"
                                }
                            ]}
                            class="transaction"
                            action={this.submitAction}
                            submitText="Search"
                        />
                        <h3>Cash value: ${this.props.user.balance ? this.props.user.balance.toLocaleString('en-US') : "LOADING"}</h3>
                        <div className="list">
                            {this.state.searchResults ? this.createSearchResultsList() : ""}
                        </div>
                    </div>
                </div>
            )
        } else {
            return ( //TODO: If bug persists, redirect to SignUp
                <SignIn redirect="/portfolio" />
            )
        }

    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {
    userUpdateBalance,
    userUpdatePortfolio
})
    (Portfolio);
