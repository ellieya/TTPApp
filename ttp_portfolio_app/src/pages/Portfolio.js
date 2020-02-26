import React from 'react';
import Page from './Page';
import SignIn from './SignIn';
import Form from './../component/Form';
import Info from './../info/info';

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
                    this.setState ({
                        "searchResults": searchResults.bestMatches
                    })
                })
        }
        console.log(info);
    }

    createSearchResultsList = () => {
        let results = [];
        this.state.searchResults.forEach((element) => {
            results.push(<span>{element["2. name"]}</span>)
        })
        return results;
    }

    render() {
        console.log("Am I being called?");
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
                            changeType={true}
                        />
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