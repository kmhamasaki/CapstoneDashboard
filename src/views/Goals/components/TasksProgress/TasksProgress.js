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
  LinearProgress,
  IconButton
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import { withRouter} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
  progress: {
    marginTop: theme.spacing(3),
  }
}));



const TasksProgress = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();
  console.log(props.goal)
  return (
    <Grid
          item
          lg={4}
          sm={6}
          xl={4}
          xs={12}
        >
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.root}>
      <div style={{ cursor: 'pointer', height: '100%' }} onClick={() => history.push('/objectives/'+props.goal.goalId)}>
        <Grid container direction="column" justify="center" className={classes.root}>
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottoms
              variant="h1"
            >
              {props.goal.name}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton aria-label="edit" onClick={(e)=>{e.stopPropagation(); props.openEditor(props.goal)}}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={(e)=>{e.stopPropagation(); props.deleteGoal(props.goal)}}>
                <DeleteIcon />
              </IconButton>
          </Grid>
        </Grid>
      </div>
      </CardContent>
    </Card>
    </Grid>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default withRouter(TasksProgress);
