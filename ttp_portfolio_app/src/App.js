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
import NavigationLogin from './component/NavigationLogin';
import { connect } from "react-redux";
import { userUpdateBasicInformation, userUpdateLoginStatus } from './redux/actions';

/**
 * Hi TTP!
 * Some of the code is a bit sloppy and unsecure since I ran out of time. I apologize in advance.
 * -Ellie
 */

class App extends React.Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     "loggedIn": cookie.load('username') ? true : false,  // User logged in status should be determined by cookie
  //     "username": cookie.load('username'),
  //     "userFunds" : cookie.load('userFunds') ? cookie.load('userFunds') : 50000,
  //     "userEmail": cookie.load('userEmail')
  //   }
  // }

  // /**
  //  * adjustState
  //  * A function called by components in order to lift state back up to application level. Any attribute and value can be supplied.
  //  */
  // adjustState = (state) => {
  //   this.setState(state)
  // }

  componentDidMount() {
    //Check if cookie exists. If it does, update redux state
    if (cookie.load('userEmail')) {
      this.props.userUpdateLoginStatus();
      this.props.userUpdateBasicInformation({
        username: cookie.load('username'),
        email: cookie.load('userEmail')
      })
      this.setState(this.props);
    }
  }

  render() {
    console.log("From App.js");
    console.log(this.props);
    return (
      <Router>
        <Navigation loggedIn={this.props.user.loginStatus} />
        <div className="body">
          <Switch>
            <Route exact path="/">
              <div className="home">
                <img src={Logo} alt="NYC Tech Talent Pipeline Logo" />
                <span>
                  <br />Asessment Stage 2<br />
                  By Ellie Chen
                </span>
              </div>
            </Route>
            <Route path="/sign-in">
              <SignIn />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/portfolio">
              <Portfolio />
            </Route>
            <Route path="/transactions">
              <Transactions />
            </Route>
          </Switch>
        </div>
      </Router >
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
        <NavigationLogin />
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

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps, {
  userUpdateBasicInformation, userUpdateLoginStatus
})
  (App);
