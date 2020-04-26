import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/styles';
import { withRouter} from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

import { AccountProfile, AccountDetails } from './components';

const classes = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

class Account extends React.Component {

  render(){  
    const { classes } = this.props;
    return (

      <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <Card>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid item md={6} xs={12}>

                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(classes)(withRouter(Account));
