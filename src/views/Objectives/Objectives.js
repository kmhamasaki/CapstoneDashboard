import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { withRouter, useParams} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/styles';
import objectivesDataImport from './ObjectivesList.js'
import ObjectiveRow from './ObjectiveRow.js'
import DatePicker from './DatePicker.js'

const classes = theme => ({
  content: {
    padding: 0
  },
  root: {
    padding: theme.spacing(3)
  },
  contentTable: {
    marginTop: theme.spacing(2)
  },
  inner: {
    minWidth: 700
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
});

class Objectives extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      openEdit: false,
      openAdd: false,
      deleteConfirm: false,
      direction: 'asc',
      sortField: 'status'
    };

    // this is how you get the url parameter
    this.goalId = props.match.params.id;

    this.openEditor = this.openEditor.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.deleteObjective = this.deleteObjective.bind(this);
    this.closeDeleteConfirm = this.closeDeleteConfirm.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this)
  }

  openEditor(objective){
    this.setState({
      openEdit: true,
      objective: objective
    })
  }

  closeEditor(){
    this.setState({
      openEdit: false,
      objective: null
    })
  }

  deleteObjective(objective){
    this.setState({
      deleteConfirm: true,
      objective: objective
    })
  }

  closeDeleteConfirm(){
    this.setState({
      deleteConfirm: false,
      objective: null
    })
  }

  toggleStatus(objective){
    let newStatus = 0;
      switch(objective.status) {
      case 0:
        newStatus = 1;
        break;
      case 1:
        newStatus = 2;
        break;
      case 2:
        newStatus = 0;
    }
    let objectiveId = objective.objectiveId;
      axios({
        method: 'post',
        url: 'http://localhost:4000/update_objective_status',
        data: {
          objectiveId: objectiveId,
          status: newStatus
        }
      })
      .catch(function (error) {
      // handle error
        alert(error);
      })
      .then(function (res) {
        console.log(res);
        let data = res.data;
        console.log(data);
        let newData = this.state.data;
        let objIndex = newData.objectives.findIndex((obj => obj.objectiveId == objective.objectiveId));
        newData.objectives[objIndex].status = newStatus

        this.setState({
              isLoaded: true,
              data: newData
            });
      }.bind(this));
  }


  componentWillMount() {
    axios({
      method: 'post',
      url: 'http://localhost:4000/get_objectives',
      data: {
        userId: 1,
        goalId: this.goalId
      }
    })
    .catch(function (error) {
    // handle error
      alert(error);
    })
    .then(function (res) {
      console.log(res);
      let data = res.data;
      console.log(data);
      // sort objectives with default field and direction
      data.objectives.sort(this.getComparator(this.state.sortField, this.state.direction))
      this.setState({
            isLoaded: true,
            data: data
          });
    }.bind(this));

  };

  // return the appropriate comparator
  // field is the field you want to sort (title, startDate, endDate, status)
  // DEFAULT IS TITLE
  // order = asc for ascending order, desc for descending order
  // DEFAULT IS ASC

  // -1 if a<b
  // 0 a == b
  // 1 if a > b
  cmpTitle(a,b){
    return a.name.localeCompare(b.name)
  }

  cmpStartDate(a,b){
    const d1 = new Date(a.startDate)
    const d2 = new Date(b.startDate)
    return d1-d2
  }

  cmpEndDate(a,b){
    const d1 = new Date(a.endDate)
    const d2 = new Date(b.endDate)
    return d1-d2
  }

  cmpStatus(a,b){
    return a.status - b.status
  }

  getComparator(field, order){
    // tiebreaker uses status to determine what should be below
    // this sorts by 'NOT STARTED' to 'IN PROGRESS' to 'COMPLETED'
    function tieBreaker(a,b) {
      return a.status - b.status
    }

    if(field === 'title'){
      return order === 'desc' 
        ? (a,b) => {
            let val = -this.cmpTitle(a,b)
            // tiebreaker
            if(val === 0){
              val += this.cmpStatus(a,b)
            }
            return val
          }
        : (a,b) => {
            let val = this.cmpTitle(a,b)
            // tiebreaker
            if(val === 0){
              val += this.cmpStatus(a,b)
            }
            return val
          }
    }
    else if(field === 'startDate'){
      return order === 'desc'
        ? (a,b) => {
          let val = -this.cmpStartDate(a,b)
          // tiebreaker
          if(val === 0){
            val += this.cmpStatus(a,b)
          }
          return val
        }
        : (a,b) => {
          let val = this.cmpStartDate(a,b)
          // tiebreaker
          if(val === 0){
            val += this.cmpStatus(a,b)
          }
          return val
        }
    }
    else if(field === 'endDate'){
      return order === 'desc'
        ? (a,b) => {
          let val = -this.cmpEndDate(a,b)
          // tiebreaker
          if(val === 0){
            val += this.cmpStatus(a,b)
          }
          return val
        }
        : (a,b) => {
          let val = this.cmpEndDate(a,b)
          // tiebreaker
          if(val === 0){
            val += this.cmpStatus(a,b)
          }
          return val
        }
    }
    else if(field === 'status'){
      return order === 'desc'
        ? (a,b) => {
          let val = -this.cmpStatus(a,b)
          if(val === 0){
            val += this.cmpEndDate(a,b)
          }
          return val
        }
        : (a,b) => {
          let val = this.cmpStatus(a,b)
          if(val === 0){
            val += this.cmpEndDate(a,b)
          }
          return val
        }
    }
  }



  render(){
    const { error, isLoaded, data } = this.state;
    const { classes } = this.props;

    // while(!isLoaded) {
    //   return <div>not here</div>
    // }
    console.log(classes);

    while(!isLoaded) {
      return <div>not here</div>
    }

    //const objectivesData = objectivesDataImport;
    const objectivesData = data.objectives;

    const openAddEditor = () => {
      this.setState({
        openAdd: true
      });
    };

    const closeAddEditor = () => {
      this.setState({
        openAdd: false
      });
    };

    const addNewObjective = event => {
      event.preventDefault();
      this.setState({
        openAdd: false
      });
      let myData = {
          name: event.target.elements.title.value,
          goalId: this.goalId,
          tags: event.target.elements.tags.value,
          assignedUsers: event.target.elements.people.value,
          startDate: event.target.elements.startDate.value,
          endDate: event.target.elements.dueDate.value,
      }
      console.log(myData);
      axios({
      method: 'post',
        url: '/create_objective',
        data:  {
          name: event.target.elements.title.value,
          goalId: this.goalId,
          tags: event.target.elements.tags.value,
          assignedUser: event.target.elements.people.value,
          startDate: event.target.elements.startDate.value,
          endDate: event.target.elements.dueDate.value,
          description: "asdfas"
      }
      })
      .catch(function (error) {
      // handle error
        alert(error);
      })
      .then(function (res) {
        console.log(res);
        let responseData = res.data;
        let newObjective = {
          goalId : myData.goalId,
          name : myData.name,
          objectiveId: responseData.objectiveId,
          tags: myData.tags,
          assignedUser: myData.assignedUsers,
          startDate: myData.startDate,
          endDate: myData.endDate,
          status: 0
        }
        console.log(data);
        data.objectives.push(newObjective);
        //setting the state "refreshes the page"
        //when you set state, it calls render() again
        this.setState({
            isLoaded: true,
            data: data
          });
      }.bind(this));

    };

    const editObjective = event => {
      event.preventDefault();

      let deets = event.target.elements;
      const objective = {
        objectiveId : this.state.objective.objectiveId,
        name: event.target.elements.title.value,
        startDate: event.target.elements.startDate.value,
        endDate: event.target.elements.dueDate.value,
        tags: event.target.elements.tags.value,
        assignedUser: event.target.elements.people.value,
        status: this.state.objective.status,
        goalId: this.state.objective.goalId,
        description: "fsdf",
      }
      console.log(objective)
      axios({
        method: 'post',
        url: 'http://localhost:4000/update_objective',
        data: objective
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
        let objIndex = newData.objectives.findIndex((obj => obj.objectiveId == objective.objectiveId));

        newData.objectives[objIndex] = objective;
        this.setState({
              isLoaded: true,
              data: newData
            });
      }.bind(this));
      this.closeEditor()
    }

    const actuallyDeleteObjective = event => {
      event.preventDefault();
      console.log("delete!!!!!!");

      const objective = this.state.objective;
      console.log(objective);
      axios({
        method: 'post',
        url: 'http://localhost:4000/delete_objective',
        data: {
          objectiveId: objective.objectiveId
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
        let objIndex = newData.objectives.findIndex((obj => obj.objectiveId == objective.objectiveId));
        newData.objectives.splice(objIndex, 1);

        this.setState({
              isLoaded: true,
              data: newData
            });
      }.bind(this));

      this.closeDeleteConfirm();
    }

    // sort objectivesData
    const sort = (newSortField, newDirection) => {
      objectivesData.sort(this.getComparator(newSortField, newDirection))
      let newData = this.state.data;
      newData.objectives = objectivesData;
      this.setState({
        data: newData,
        sortField: newSortField,
        direction: newDirection
      })
    }


    const ObjectiveRows = objectivesData.map(objective => (
                        <ObjectiveRow key={objective.id} objective={objective} openEditor={this.openEditor} deleteObjective={this.deleteObjective} toggleStatus={this.toggleStatus}/>
                        ))

    return (
      <div className={classes.root}>
        <div className={classes.contentTable}>
        <div>
          <Card>
            <CardHeader
              title="Your Objectives"
            />
            <Divider />
            <CardContent className={classes.content}>
              <PerfectScrollbar>
                <div className={classes.inner}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={this.state.sortField === 'title'}
                            direction={this.state.sortField === 'title' ? this.state.direction : 'asc'}
                            onClick={()=>sort('title',this.state.direction === 'asc' && this.state.sortField === 'title' ? 'desc' : 'asc')}
                          >
                          Title
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={this.state.sortField === 'startDate'}
                            direction={this.state.sortField === 'startDate' ? this.state.direction : 'asc'}
                            onClick={()=>sort('startDate',this.state.direction === 'asc' && this.state.sortField === 'startDate' ? 'desc' : 'asc')}
                          >Start Date
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={this.state.sortField === 'endDate'}
                            direction={this.state.sortField === 'endDate' ? this.state.direction : 'asc'}
                            onClick={()=>sort('endDate',this.state.direction === 'asc' && this.state.sortField === 'endDate' ? 'desc' : 'asc')}
                          >End Date
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>People</TableCell>
                        <TableCell>Tags</TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={this.state.sortField === 'status'}
                            direction={this.state.sortField === 'status' ? this.state.direction : 'asc'}
                            onClick={()=>sort('status',this.state.direction === 'asc' && this.state.sortField === 'status'? 'desc' : 'asc')}
                          >Status
                          </TableSortLabel>
                        </TableCell>
                        <TableCell 
                          align="right"
                          style={{width: 96+16+16}}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ObjectiveRows}
                      <TableRow
                        hover
                        onClick={openAddEditor}
                      >
                        <Tooltip title="Add Objective" arrow>
                          <TableCell
                            colSpan={7}
                            align="center"
                          >
                            <AddIcon />
                          </TableCell>
                        </Tooltip>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </PerfectScrollbar>
            </CardContent>
          </Card>
        </div>
        </div>
        <Dialog open={this.state.openEdit} onClose={this.closeEditor} aria-labelledby="edit-objective">
              <DialogTitle id="edit-objective">Edit Objective</DialogTitle>
              <DialogContent>
                <form
                  id="editObjective"
                  className={classes.form}
                  onSubmit={editObjective}
                >
                  <TextField
                    id="title"
                    margin="dense"
                    name="title"
                    label="Title"
                    multiline
                    variant="outlined"
                    defaultValue={this.state.objective ? this.state.objective.name : ""}
                    fullWidth
                  />
                  <DatePicker startDate={this.state.objective ? this.state.objective.startDate : ""}
                  dueDate={this.state.objective ? this.state.objective.endDate : ""}/>
                  <TextField
                    id="people"
                    margin="dense"
                    name="people"
                    label="People"
                    multiline
                    variant="outlined"
                    defaultValue={this.state.objective ? this.state.objective.assignedUser : ""}
                    fullWidth
                  />
                  <TextField
                    id="tags"
                    margin="dense"
                    name="tags"
                    label="Tags"
                    multiline
                    variant="outlined"
                    defaultValue={this.state.objective ? this.state.objective.tags : ""}
                    fullWidth
                  />
                <Button color="primary" type="submit">
                  Edit
                </Button>
                </form>
              </DialogContent>
        </Dialog>
        <Dialog open={this.state.openAdd} onClose={closeAddEditor} aria-labelledby="add-objective">
              <DialogTitle id="add-objective">Create New Objective</DialogTitle>
              <DialogContent>
                <form
                  id="addNewObjective"
                  className={classes.form}
                  onSubmit={addNewObjective}
                >
                  <TextField
                    id="title"
                    margin="dense"
                    name="title"
                    label="Title"
                    multiline
                    variant="outlined"
                    fullWidth
                  />
                  <DatePicker startDate={new Date()} dueDate={new Date()}/>
                  <TextField
                    id="people"
                    margin="dense"
                    name="people"
                    label="People"
                    multiline
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    id="tags"
                    margin="dense"
                    name="tags"
                    label="Tags"
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
        <Dialog open={this.state.deleteConfirm} onClose={this.closeDeleteConfirm} aria-labelledby="delete-confirmation">
          <DialogTitle id="delete-confirmation">Are you sure you want to delete objective?</DialogTitle>
          <DialogContent>
            <form
              id="deleteObjective"
              className={classes.form}
              onSubmit={actuallyDeleteObjective}
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
    )
  }
}

export default withStyles(classes)(withRouter(Objectives));
