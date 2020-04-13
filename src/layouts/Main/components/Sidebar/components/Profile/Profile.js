import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/styles';

const classes = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
});

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  componentWillMount() {
    let storageEmail = localStorage.getItem('email');
    console.log(storageEmail);
    axios({
      method: 'post',
      url: 'http://localhost:4000/get_user',
      data: {
        email: storageEmail,
      }
    })
    .catch(function (error) {
    // handle error
      alert(error);
    })
    .then(function (res) {
      console.log(res);
      let data = res.data;
      this.setState({
            isLoaded: true,
            name: "Welcome " + data.fname + " " + data.lname + "!"
          });
    }.bind(this));

  };

  render() {
    const { className, ...rest } = this.props;
    const { name, isLoaded } = this.state;

    return (
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Typography
          className={classes.name}
          variant="h4"
        >
          {name}
        </Typography>
      </div>
    );
  };
}



export default withStyles(classes)(Profile);
