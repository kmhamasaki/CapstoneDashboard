import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  FormHelperText,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {fire, loggedIn} from '../../config/Fire';
import firebase from 'firebase';
import {authenticated} from 'App'

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
      justifyContent: 'center'

  },
  form: {
        alignItems: 'center',
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = useCallback(async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await fire.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function() {
        fire
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value);
        localStorage.setItem(loggedIn, true);
      })
    } catch (error) {
      alert(error);
    }
  }, [history]);

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.contentBody}>
            <form
              className={classes.form}
              onSubmit={handleSignUp}
            >
              <Typography
                className={classes.title}
                variant="h2"
              >
                Create new account
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
              >
                Use your email to create new account
              </Typography>
              <TextField
                className={classes.textField}
                error={hasError('firstName')}
                fullWidth
                helperText={
                  hasError('firstName') ? formState.errors.firstName[0] : null
                }
                label="First name"
                name="firstName"
                onChange={handleChange}
                type="text"
                value={formState.values.firstName || ''}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                error={hasError('lastName')}
                fullWidth
                helperText={
                  hasError('lastName') ? formState.errors.lastName[0] : null
                }
                label="Last name"
                name="lastName"
                onChange={handleChange}
                type="text"
                value={formState.values.lastName || ''}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                error={hasError('email')}
                fullWidth
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
                label="Email address"
                name="email"
                onChange={handleChange}
                type="text"
                value={formState.values.email || ''}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                error={hasError('password')}
                fullWidth
                helperText={
                  hasError('password') ? formState.errors.password[0] : null
                }
                label="Password"
                name="password"
                onChange={handleChange}
                type="password"
                value={formState.values.password || ''}
                variant="outlined"
              />
              <Button
                className={classes.signUpButton}
                color="primary"
                disabled={!formState.isValid}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign up now
              </Button>
              <Typography
                color="textSecondary"
                variant="body1"
              >
                Have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/sign-in"
                  variant="h6"
                >
                  Sign in
                </Link>
              </Typography>
            </form>
          </div>
        </div>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
