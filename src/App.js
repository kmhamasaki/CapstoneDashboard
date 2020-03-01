import React, { Component } from 'react';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import {Routes } from './Routes';
import { AuthProvider } from "./Auth";
import { SignIn, SignUp, Goals } from './views';
import {fire, loggedIn} from './config/Fire';
import { RouteWithLayout } from './components';
import axios from 'axios';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

export var authenticated = false;
const currentUser = null;

//axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default class App extends Component {

  componentWillMount() {
    this.setState({ loading: 'true' });

    fire.auth().onAuthStateChanged(user => {
      if (!!user) {
        console.log("true");
        authenticated = true;
        localStorage.setItem(loggedIn, true);
        if(browserHistory.location.pathname == 'sign-in' ||
          browserHistory.location.pathname == 'sign-up') {
          browserHistory.push('/dashboard');
        }
      } else {
        console.log("false")
        localStorage.setItem(loggedIn, false);
        if(browserHistory.location.pathname != 'sign-in' ||
          browserHistory.location.pathname != 'sign-up') {
          browserHistory.push('/sign-in');
        }
        authenticated = false;
      }
    });
    this.setState({ loading: 'false' });

  }
constructor(props) {
  super(props);
  fire.auth().onAuthStateChanged(this.onAuthStateChanged);
  this.loggedIn = localStorage.getItem(loggedIn) || authenticated;
  authenticated = this.loggedIn;
}
  onAuthStateChanged = (user) => {
    this.setState({
      loading: false,
      user:  user,
    });
  };
  render() {
    if (this.state.loading === 'true') {
      return null;
    }

    return (
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
          <Route path="/sign-in" component={SignIn}/>
          <Route path="/sign-up" component={SignUp}/>
        </Router>
      </ThemeProvider>
    );
  }
}
