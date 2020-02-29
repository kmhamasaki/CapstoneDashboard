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

export default class App extends Component {

  componentWillMount() {
    fire.auth().onAuthStateChanged(user => {
      if (!!user) {
        authenticated = true;
        localStorage.setItem(loggedIn, true);
      } else {
        localStorage.setItem(loggedIn, false);
        authenticated = false;
        browserHistory.push('/sign-in');
      }
  });
  }
constructor(props) {
  super(props);
  fire.auth().onAuthStateChanged(this.onAuthStateChanged);
  this.user = localStorage.getItem(loggedIn);
  if(this.user != null) 
    authenticated = true;
}
  onAuthStateChanged = (user) => {
    this.setState({
      loading: false,
      user:  user,
    });
  };
  render() {
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
