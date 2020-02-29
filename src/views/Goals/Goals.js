import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import { withRouter} from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Goals = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Goals page

                </Typography>       </Grid>
    </div>
  );
};

export default withRouter(Goals);
