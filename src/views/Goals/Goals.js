import React, { useCallback, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, 
  IconButton, 
  Card, 
  CardContent,
  Typography, 
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
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
      open: false
    };
    this.strategyId = props.match.params.id
  }

  componentWillMount() {
    axios({
      method: 'post',
      url: 'http://localhost:4000/get_goals',
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
      return <div>not here</div>
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
    const handleCreate = () => {
      //dosomething here
    };

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
        url: '/create_goal',
        data: {
          strategyId: this.strategyId,
          name: name,
          description: description,
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
          strategyId : responseData.strategyId,
          name : name,
          goals : [],
          description : description
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

    console.log(data);

    let goals = data.goals;
    console.log(goals)
    console.log("error is"+data.error)
    const cards=[];

    for(var i=0;i<goals.length;i++){
      // push the component to elements!
      cards.push(<TasksProgress goal={ goals[i] } />);
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
        </div>
      );
    };
  };

export default withStyles(classes)(withRouter(Goals));
