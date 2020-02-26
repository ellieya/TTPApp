import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import Page from './pages/Page'; //Consider renaming
import cookie from 'react-cookies';
import Logo from './img/ttplogo.png';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      "loggedIn": cookie.load('username') ? true : false,  // User logged in status should be determined by cookie
      "username": cookie.load('username')
    }
  }

  componentDidMount() {
    //Check cookies for user logged in
  }

  /**
   * adjustState
   * A function called by components in order to lift state back up to application level. Any attribute and value can be supplied.
   */
  adjustState = (state) => {
    this.setState(state)
  }

  render() {
    return (
      <Router>
        <Navigation loggedIn={this.state.loggedIn} action={this.adjustState} appState={this.state} />
        <div className="body">
          <Switch>
            <Route exact path="/">
              <div className="home">
                <img src={Logo} alt="NYC Tech Talent Pipeline Logo" />
                <span>
                  <br />Asessment Part 2<br />
                  By Ellie Chen
                </span>
              </div>
            </Route>
            <Route path="/sign-in">
              <SignIn action={this.adjustState} appState={this.state} />
            </Route>
            <Route path="/register">
              <Register action={this.adjustState} appState={this.state} />
            </Route>
            <Route path="/portfolio">
              <Portfolio action={this.adjustState} appState={this.state} />
            </Route>
            <Route path="/transactions">
              <Transactions action={this.adjustState} appState={this.state} />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

class Navigation extends Page {
  render() {
    if (this.props.loggedIn) {
      return (<div className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
        </ul>
        <div className="user-logged-in">
          <span>Welcome, {this.props.appState.username}!</span>
          <button onClick={() => {
            this.adjustAppState({
              loggedIn: false
            });
            cookie.remove('username');
          }}>Log out</button>
        </div>
      </div>)
    } else {
      return (<div className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/sign-in">Sign In</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </div>)
    }
  }
}

export default App;
