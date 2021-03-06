import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, colors } from '@material-ui/core';
import fire from '../../../../../../config/Fire';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: colors.grey[50]
  },
  media: {
    paddingTop: theme.spacing(2),
    height: 80,
    textAlign: 'center',
    '& > img': {
      height: '100%',
      width: 'auto'
    }
  },
  content: {
    padding: theme.spacing(1, 2)
  },
  actions: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    justifyContent: 'center'
  }
}));


const UpgradePlan = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();

  function logOut() {
    fire.auth().signOut();
    history.push('/sign-in');
    console.log("Signingout");
  }
  return (

      <div className={classes.actions}>
        <Button
          color="primary"
          component="a"
          onClick={logOut}
          variant="contained"
        >
          Sign Out
        </Button>
      </div>
  );
};

UpgradePlan.propTypes = {
  className: PropTypes.string
};

export default withRouter(UpgradePlan);
