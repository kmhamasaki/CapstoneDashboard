import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  LinearProgress
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import { withRouter} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  }
}));



const TasksProgress = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();
  console.log(props.strategy);
  
  return (
    <Grid
          item
          lg={4}
          sm={6}
          xl={4}
          xs={12}
        >
        <div style={{ cursor: 'pointer' }} onClick={() => history.push('/goals/'+props.strategy.strategyId)}>

    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottoms
              variant="h1"
            >
              {props.strategy.name}
            </Typography>
            <Typography variant="h3">{props.strategy.completion ? props.strategy.completion : 0}%</Typography>
          </Grid>
        </Grid>
        <LinearProgress
          className={classes.progress}
          value={props.strategy.completion ? props.strategy.completion : 0}
          variant="determinate"
        />
      </CardContent>
    </Card>
    </div>
    </Grid>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default withRouter(TasksProgress);
