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
  TasksProgress,
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
      open: false,
      openEdit: false,
      deleteConfirm: false,
    };
    this.closeEditor = this.closeEditor.bind(this);
    this.deleteObjective = this.deleteObjective.bind(this);
    this.closeDeleteConfirm = this.closeDeleteConfirm.bind(this);

  }



  closeEditor(){
    this.setState({
      openEdit: false,
      strategy: null,
    })
  }


  deleteObjective(strategy){
    this.setState({
      deleteConfirm: true,
      strategy: strategy,
    })
  }

  closeDeleteConfirm(){
    this.setState({
      deleteConfirm: false,
      strategy: null
    })
  }

  componentWillMount() {
    axios({
      method: 'post',
      url: 'https://capstone-strategic-planning.herokuapp.com/get_strategies',
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

    const openEditor = strategy => {
      this.setState({
        openEdit: true,
        strategy: strategy,
      })
    }


    const workplaceHandleClick = event => {
      event.preventDefault();

      this.setState({
        open: false
      });
      const name = event.target.elements.title.value;
      const description = "description";
      axios({
      method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/create_strategy',
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

    const editStrategy = event => {
      event.preventDefault();

      let deets = event.target.elements;
      const strategy = {
        strategyId : this.state.strategy.strategyId,
        name: event.target.elements.title.value,
        description: "description"
      }
      axios({
        method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/update_strategy',
        data: strategy
      })
      .catch(function (error) {
      // handle error
        alert(error);
      })
      .then(function (res) {
        let resdata = res.data;
        let newData = this.state.data;
        let objIndex = newData.strategies.findIndex((obj => obj.strategyId == strategy.strategyId));

        if(objIndex >= 0)
          newData.strategies[objIndex] = strategy;
        this.setState({
              isLoaded: true,
              data: newData
            });
        this.closeEditor()
      }.bind(this));
    }

    const actuallyDeleteStrategy = event => {
      event.preventDefault();

      const strategy = this.state.strategy;
      axios({
        method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/delete_strategy',
        data: {
          strategyId: strategy.strategyId
        }
      })
      .catch(function (error) {
        alert(error);
      })
      .then(function (res) {
        let data = res.data;
        let newData = this.state.data;
        let objIndex = newData.strategies.findIndex((obj => obj.strategyId == strategy.strategyId));
        if(objIndex >= 0)
          newData.strategies.splice(objIndex, 1);

        this.setState({
              isLoaded: true,
              data: newData
            });
      }.bind(this));

      this.closeDeleteConfirm();
    }

    const strategies = data.strategies;
    const cards=[];

    for(var i=0;i<strategies.length;i++){
      // push the component to elements!
      cards.push(<TasksProgress strategy={ strategies[i] } openEditor={openEditor} deleteObjective={this.deleteObjective}  />);
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
              <Button color="primary" type="submit">
                Create
              </Button>
              </form>
            </DialogContent>
            </Dialog>
                <Dialog open={this.state.openEdit} onClose={this.closeEditor} aria-labelledby="edit-objective">
                <DialogTitle id="edit-strategy">Edit Strategy</DialogTitle>
                <DialogContent>
                  <form
                    id="editStrategy"
                    className={classes.form}
                    onSubmit={editStrategy}
                  >
                    <TextField
                      id="title"
                      margin="dense"
                      name="title"
                      label="Title"
                      multiline
                      variant="outlined"
                      defaultValue={this.state.strategy ? this.state.strategy.name : ""}
                      fullWidth
                    />
                  <Button color="primary" type="submit">
                    Edit
                  </Button>
                  </form>
                </DialogContent>
          </Dialog>
          <Dialog open={this.state.deleteConfirm} onClose={this.closeDeleteConfirm} aria-labelledby="delete-confirmation">
          <DialogTitle id="delete-confirmation">Are you sure you want to delete strategy?</DialogTitle>
            <DialogContent>
              <form
                id="deleteObjective"
                className={classes.form}
                onSubmit={actuallyDeleteStrategy}
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

export default withStyles(classes)(withRouter(MyWorkspace));
