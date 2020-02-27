import React from 'react';
import Page from './Page';
import SignIn from './SignIn';
import Form from './../component/Form';
import Info from './../info/info';
import StockResult from './../component/StockResult';

class Portfolio extends Page {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchResults: []
        };
    }

    async componentDidMount() {
        //Get all stocks owned from backend
        let flags = []; //Makeshift method of checking since we're running out of time
        this.totalPortfolioValue = 0;

        console.log(this.props.appState.userEmail);
        await fetch(Info.backEndUrl + "/getAllStock", {
            method: "POST",
            body: JSON.stringify({
                user: this.props.appState.userEmail
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async (res) => {
                let json = await res.json();
                console.log(json);
                this.ownedStockList = json;
                flags.push(true);
            })

        // //For each ownedStockList, we now want to get the price.
        // this.ownedStockListPrices = [];
        // this.ownedStockList.forEach( async (element) => {
        //     await fetch(Info.IEXUrl + "/stock/" + element.stock + "/quote?" + Info.IEXAPIKeyUrlParam)
        //         .then(async (res) => {
        //             let json = await res.json();
        //             let stockPrice = Number.parseFloat(json.latestPrice).toFixed(2);
        //             this.totalPortfolioValue += stockPrice;
        //             this.ownedStockListPrices.push(stockPrice);
        //             flags.push(true);
        //         })
        // })
        // console.log("Owned stock prices");
        // console.log(this.ownedStockListPrices);


        //Get cash balance from backend
        await fetch(Info.backEndUrl + "/getCash", {
            method: "POST",
            body: JSON.stringify({
                user: this.props.appState.userEmail
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async (res) => {
                let json = await res.json();
                console.log("User funds:" + json)
                this.props.action({
                    userFunds: json
                })
                flags.push(true);
            })

        if (flags.length == 2) {
            this.setState({
                loading: false
            })
        }
    }

    async componentDidUpdate() {
        if (this.state.loading) {
            // this.componentDidMount();
        }
    }

    getOwnedStocks = () => {

        let stockList = [];

        //Run only when load is finished
        if (!this.state.loading) {
            let i = 0; //I'm so sorry I know this is terrible practice
            this.ownedStockList.forEach((element) => {
                stockList.push(
                    <tbody>
                        <tr>
                            <td>{element.stock}</td>
                            <td>{element.qty}</td>
                            {/* <td>{this.ownedStockListPrices[i]}</td> */}
                            {/* <td>{ Number.parseFloat(this.ownedStockListPrices[i]) * Number.parseInt(element.qty)}</td> */}
                        </tr>
                    </tbody>
                )
                i++;
            })
        }

        return stockList;
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

    adjustPortfolioState = (state) => {
        this.setState(
            state
        )
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

    render() {
        console.log(this.state);
        if (this.props.appState.loggedIn) {
            return (
                <div className="portfolio">
                    <div className="portfolio-side">
                        <h1>Portfolio ($totalvalue)</h1>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Stock</th>
                                    <th>Qty</th>
                                    <th>Total Value</th>
                                </tr>
                            </thead>
                            {this.getOwnedStocks()}
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
                        <h3>Cash value: ${this.props.appState.userFunds.toLocaleString('en-US')}</h3>
                        <div className="list">
                            {this.createSearchResultsList()}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <SignIn redirect="/portfolio" />
            )
        }

    }
}

export default Portfolio;