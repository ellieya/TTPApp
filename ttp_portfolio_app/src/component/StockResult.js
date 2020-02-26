import React from 'react';
import Info from './../info/info';
import cookie from 'react-cookies';

/**
 * Expected props:
 * ticker (mandatory) - Stock ticker
 * name (mandatory) - Company name
 * 
 * 
 * IEX Cloud API is used to grab prices due to generous call count, but AlphaVantage can't be dropped because IEX Cloud lacks a free search API.
 */

class StockResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonValue: "Buy",
            price: "Loading...",
            loading: true,
            stock: this.props.ticker, //Placed in state in order to easily supply information to backend
            user: cookie.load('userEmail') //Placed in state in order to easily supply information to backend
            //TODO: better to get information from app-level state, revise if we have time
            /*
            Other currently undefined attributes:
            qty
            cost
            */
        }
    }

    async componentDidMount() {
        //IEX to fetch and update price
        await fetch(Info.IEXUrl + "/stock/" + this.props.ticker + "/quote?" + Info.IEXAPIKeyUrlParam)
            .then(async (res) => {
                let json = await res.json();
                this.setState({
                    price: Number.parseFloat(json.latestPrice).toFixed(2)
                })
            })
    }

    async buyStock() {
        await fetch(Info.backEndUrl + "/buy",
            {
                method: "POST",
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                let json = await res.json();
                console.log(json.success);
                if (json.success) {
                    alert("Transaction success!");
                    //Raise state up
                } else {
                    alert("ERROR:\n" + json.status);
                }
            })
    }

    /**
     * Determines what to print on the left of the inputs
     * If we have time to clean this up, we should combine left and right inputs together since the conditions to cause changes are similar.
     */
    determinePrint = () => {
        if (this.state.buttonValue !== "Confirm") { //Want to make !== Confirm to guarantee else executes only if button is Confirm
            return (<div className="dynamic">
                Price: ${this.state.price}
                <br />
                <div className="inputs">
                    <input type="number" placeholder="Qty" onChange={(e) => { this.setState({ "qty": e.target.value }) }} />
                    <button onClick={
                        () => {
                            //Check if valid amount of stock (not negative, not 0)
                            if (this.state.qty > 0)
                                this.setState({
                                    buttonValue: "Confirm",
                                    cost: Number.parseFloat(this.state.price * this.state.qty).toFixed(2)
                                })
                            else
                                alert("Please enter a positive integer value!")
                        }
                    }
                    >{this.state.buttonValue}</button>
                </div>
            </div>)
        } else {
            return (
                <div className="dynamic">
                    <span>Cost: ${this.state.price * this.state.qty}</span>
                    <br />
                    <div className="inputs">
                        <button onClick={
                            () => {

                                //CALL BACKEND FUNCTION TO PURCHASE
                                this.buyStock();
                                //TODO: Lift state up with this line
                            }
                        }
                        >{this.state.buttonValue}</button>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="stock-result">
                <div className="ticker">{this.props.ticker}</div>
                <div className="supplemental-text">
                    {this.props.name}
                </div>
                <div className="action-inputs">
                    {this.determinePrint()}
                </div>
            </div>
        )
    }
}

export default StockResult;