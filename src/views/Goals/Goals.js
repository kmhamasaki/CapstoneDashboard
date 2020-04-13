import React, { useCallback, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, 
  Button,
  IconButton, 
  Card, 
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography, 
  TextField,
} from '@material-ui/core';
import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders
} from './components';
import { withRouter} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import POST_URL from 'App'
import axios from 'axios';
import { withStyles } from '@material-ui/styles';

const classes = theme => ({
  loadingRoot:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  root: {
    padding: theme.spacing(4)
  },
  cardRoot: {
    height: '100%',
    alignItems: 'center',

  },
  content: {
    alignItems: 'center',
    display: 'flex',
    alignContent: 'center',
    justify:"center",

  },
  title: {
    fontWeight: 700,
    align: 'center',
  },
  addIcon: {
    height: 32,
    width: 32
  },
  cardContent: {
    alignContent: 'center',
  }
});

class Goals extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      open: false,
      openEdit: false,
      deleteConfirm: false,
    };
    this.strategyId = props.match.params.id
    this.closeEditor = this.closeEditor.bind(this);
    this.deleteGoal = this.deleteGoal.bind(this);
    this.closeDeleteConfirm = this.closeDeleteConfirm.bind(this);

  }

  closeEditor(){
    this.setState({
      openEdit: false,
      goal: null,
    })
  }


  deleteGoal(goal){
    console.log("106");
    this.setState({
      deleteConfirm: true,
      goal: goal,
    })
  }

  closeDeleteConfirm(){
    this.setState({
      deleteConfirm: false,
      goal: null
    })
  }

  componentWillMount() {
    axios({
      method: 'post',
      url: 'https://capstone-strategic-planning.herokuapp.com/get_goals',
      data: {
        strategyId: this.strategyId
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
            data: data
          });
    }.bind(this));

  };
  render() {
    const { error, isLoaded, data } = this.state;
    const { classes } = this.props;

    while(!isLoaded) {
      return <div className={classes.loadingRoot}>
        <CircularProgress />
      </div>
    }

    const handleClickOpen = () => {
      this.setState({
        open: true
      });
    };

    const handleClose = () => {
      this.setState({
        open: false
      });
    };

    const openEditor = goal => {
      console.log("HERE")
      console.log(goal)
      this.setState({
        openEdit: true,
        goal: goal,
      })
    }

    const workplaceHandleClick = event => {
      event.preventDefault();

      this.setState({
        open: false
      });
      console.log(event.target.elements)
      const name = event.target.elements.title.value;
      console.log(name)
      const description = event.target.elements.description.value;
      console.log(description)
      console.log(this.strategyId)
      axios({
      method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/create_goal',
        data: {
          strategyId: this.strategyId,
          name: name,
          description: description == "" ? "description" : description,
          startDate: "01/01/2020",
          endDate: "01/01/2020"
        }
      })
      .catch(function (error) {
      // handle error
        alert(error);
      })
      .then(function (res) {
        console.log(res);
        let responseData = res.data;
        let newStrategy = {
          strategyId : this.strategyId,
          goalId: responseData.goalId,
          name : name,
          objectives : [],
          description: description == "" ? "description" : description
        }
        data.goals.push(newStrategy);
        // setting the state "refreshes the page"
        // when you set state, it calls render() again
        this.setState({
            isLoaded: true,
            data: data
          });
      }.bind(this));
    };

    const editGoal = event => {
      event.preventDefault();

      let deets = event.target.elements;
      const goal = {
        goalId : this.state.goal.goalId,
        strategyId: this.state.goal.strategyId,
        name: event.target.elements.title.value,
        description: "description"
      }
      console.log(goal)
      axios({
        method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/update_goal',
        data: goal
      })
      .catch(function (error) {
      // handle error
        alert(error);
      })
      .then(function (res) {
        console.log(res);
        let resdata = res.data;
        console.log(resdata);

        let newData = this.state.data;
        console.log(newData);
        let objIndex = newData.goals.findIndex((obj => obj.goalId == goal.goalId));

        if(objIndex >= 0)
          newData.goals[objIndex] = goal;
        this.setState({
              isLoaded: true,
              data: newData
            });
        this.closeEditor()
      }.bind(this));
    }

    const actuallyDeleteGoal = event => {
      event.preventDefault();
      console.log("delete!!!!!!");

      const goal = this.state.goal;
      console.log(goal);
      axios({
        method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/delete_goal',
        data: {
          goalId: goal.goalId
        }
      })
      .catch(function (error) {
        alert(error);
      })
      .then(function (res) {
        console.log(res);
        let data = res.data;
        console.log(data);
        let newData = this.state.data;
        console.log(newData);
        let objIndex = newData.goals.findIndex((obj => obj.goalId == goal.goalId));
        if(objIndex >= 0)
          newData.goals.splice(objIndex, 1);

        this.setState({
              isLoaded: true,
              data: newData
            });
      }.bind(this));

      this.closeDeleteConfirm();
    }


    console.log(data);

    let goals = data.goals;
    console.log(goals)
    console.log("error is"+data.error)
    const cards=[];

    for(var i=0;i<goals.length;i++){
      // push the component to elements!
      cards.push(<TasksProgress goal={ goals[i] } openEditor={openEditor} deleteGoal={this.deleteGoal}/>);
    }

      return (
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            {cards}
             <Grid
              item
              lg={4}
              sm={6}
              xl={4}
              xs={12}
            >
              <Card className={classes.cardRoot}>
                <CardContent className={classes.cardContent}>
                  <Grid
                    container
                    className = {classes.content}
                  >
                    <Grid item>
                      <IconButton aria-label="add" onClick={handleClickOpen}>
                        <AddIcon className={classes.addIcon} />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottoms
                        variant="h1"
                      >
                      Add Goal
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Dialog open={this.state.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Goal</DialogTitle>
            <DialogContent>
              <form
                className={classes.form}
                onSubmit={workplaceHandleClick}
              >
                <TextField
                  autoFocus
                  id="title"
                  margin="dense"
                  name="title"
                  label="Title"
                  multiline
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="description"
                  margin="dense"
                  name="description"
                  label="Description"
                  multiline
                  rows="4"
                  variant="outlined"
                  fullWidth
                />
              <Button color="primary" type="submit">
                Create
              </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={this.state.openEdit} onClose={this.closeEditor} aria-labelledby="edit-objective">
                <DialogTitle id="edit-strategy">Edit Goal</DialogTitle>
                <DialogContent>
                  <form
                    id="editGoal"
                    className={classes.form}
                    onSubmit={editGoal}
                  >
                    <TextField
                      id="title"
                      margin="dense"
                      name="title"
                      label="Title"
                      multiline
                      variant="outlined"
                      defaultValue={this.state.goal ? this.state.goal.name : ""}
                      fullWidth
                    />
                  <Button color="primary" type="submit">
                    Edit
                  </Button>
                  </form>
                </DialogContent>
          </Dialog>
          <Dialog open={this.state.deleteConfirm} onClose={this.closeDeleteConfirm} aria-labelledby="delete-confirmation">
          <DialogTitle id="delete-confirmation">Are you sure you want to delete goal?</DialogTitle>
            <DialogContent>
              <form
                id="deleteObjective"
                className={classes.form}
                onSubmit={actuallyDeleteGoal}
              >

              <Button style={{color: '#ff0000'}} color="primary" type="submit">
                Delete
              </Button>
              <Button color="secondary" onClick={this.closeDeleteConfirm}>
                Don't delete
              </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    };
  };

export default withStyles(classes)(withRouter(Goals));
