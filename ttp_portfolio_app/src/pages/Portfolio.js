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

    componentDidMount() {

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

    createSearchResultsList = () => {
        let results = [];
        try {
            this.state.searchResults.forEach((element) => {
                //For maximum compatability between two used APIs, only push results for US market
                if (element["4. region"] === "United States") {
                    results.push(
                        <StockResult ticker={element["1. symbol"]} name={element["2. name"]} key={element["1. symbol"]} />
                    )
                }
            })
        } catch (err) {
            alert("If you are getting this message, the API key has either expired or reached its limit. Please wait ~60 seconds, or wait until tomorrow. Thank you!")
        }
        return results;
    }

    render() {
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
                            <tbody>
                                <tr>
                                    <td>Example</td>
                                    <td>5</td>
                                    <td>Example value * 5</td>
                                </tr>
                            </tbody>
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