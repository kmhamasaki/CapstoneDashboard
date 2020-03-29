import React, { useCallback, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, 
  IconButton, 
  Card, 
  CardContent,
  CardMedia,
  CircularProgress,
  Typography, 
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip
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
import AddCard from '../../components/AddCard';

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
    display: 'flex'

  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justify:"center"
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
    alignItems: 'center',
    alignContent: 'center'
  },
  maxHeightWidth: {
    height: "100%",
    width: "100%"
  }
});

class MyWorkspace extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      open: false
    };
  }

  componentWillMount() {
    axios({
      method: 'post',
      url: 'http://localhost:4000/get_strategies',
      data: {
        workspaceId: 1,
        userId: 1
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
    const handleCreate = () => {
      //dosomething here
    };

    const workplaceHandleClick = event => {
      event.preventDefault();

      this.setState({
        open: false
      });
      console.log(event.target.elements.title.value);
      console.log(event.target.elements.description.value);
      const name = event.target.elements.title.value;
      const description = event.target.elements.description.value;
      axios({
      method: 'post',
        url: '/create_strategy',
        data: {
          name: name,
          description: description
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
        data.strategies.push(newStrategy);
        // setting the state "refreshes the page"
        // when you set state, it calls render() again
        this.setState({
            isLoaded: true,
            data: data
          });
      }.bind(this));

    };

    console.log(data)
    const strategies = data.strategies;
    const cards=[];

    for(var i=0;i<strategies.length;i++){
      // push the component to elements!
      cards.push(<TasksProgress strategy={ strategies[i] } />);
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
              xl={4}
              lg={4}
              sm={6}
              xs={12}
              >
              <Card className={classes.cardRoot}>
                  <CardMedia className={classes.cardContent, classes.maxHeightWidth}>
                    <Tooltip arrow title="Add Strategy">
                      <Button
                        variant="contained"
                        color="default"
                        className={classes.button,classes.maxHeightWidth}
                        startIcon={<AddIcon />}
                        onClick={handleClickOpen}
                      > 
                      </Button>
                    </Tooltip>
                  </CardMedia>
                </Card>
              </Grid>
             <Grid
              item
              xl={4}
              lg={4}
              sm={6}
              xs={12}
            >
            {/*}
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
                      Add Strategy
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            {*/}
            </Grid>
          </Grid>
          <Dialog open={this.state.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Strategy</DialogTitle>
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

export default withStyles(classes)(withRouter(MyWorkspace));
