import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button,Grid, Typography } from '@material-ui/core';
import { withRouter} from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Goals = props => {
  const classes = useStyles();
  const { history } = props;

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

                </Typography>
                <Button onClick={() => history.push('/objectives')}>
                Button
                </Button>   

                </Grid>
    </div>
  );
};

export default withRouter(Goals);
