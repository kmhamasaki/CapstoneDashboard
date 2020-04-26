import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
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
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { withRouter, useParams} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/styles';
import objectivesDataImport from './ObjectivesList.js'
import ObjectiveRow from './ObjectiveRow.js'
import DatePicker from './DatePicker.js'

const classes = theme => ({
  loadingRoot:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
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

class MyObjectives extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      openEdit: false,
      openAdd: false,
      deleteConfirm: false,
      showFilters: false,
      direction: 'asc',
      sortField: 'status',
      filterTags: [],
      filterStatus: [false,false,false],
      filterUsers: [],
      tagsSelected: [],
      usersSelected: []
    };

    // this is how you get the url parameter
    this.goalId = props.match.params.id;
    this.closeEditor = this.closeEditor.bind(this);
    this.deleteObjective = this.deleteObjective.bind(this);
    this.closeDeleteConfirm = this.closeDeleteConfirm.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this)
  }

  closeEditor(){
    this.setState({
      openEdit: false,
      objective: null,
      tagsSelected: [],
      usersSelected: []
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
        url: 'https://capstone-strategic-planning.herokuapp.com/update_objective_status',
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
        let data = res.data;
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
    // get objectives
    let storageEmail = localStorage.getItem('email');
    axios({
      method: 'post',
      url: 'https://capstone-strategic-planning.herokuapp.com/get_my_objectives',
      data: {
        userId: storageEmail,
      }
    })
    .catch(function (error) {
    // handle error
      alert(error);
    })
    .then(function (res) {
      let data = res.data;
      // sort objectives with default field and direction
      data.objectives.map(objective=>{
        // error checking
        if(!Array.isArray(objective.tags)){
          objective.tags = []
        }
        if(!Array.isArray(objective.assignedUsers)){
          objective.assignedUsers = []
        }
      })
      data.objectives.sort(this.getComparator(this.state.sortField, this.state.direction))
      this.setState({
            isLoaded: true,
            data: data
          });
    }.bind(this));

    // get all users
    axios({
      method: 'post',
      url: 'https://capstone-strategic-planning.herokuapp.com/get_all_users',
    })
    .catch(function (error) {
    // handle error
      alert(error);
    })
    .then(function (res) {
      let data = res.data;
      // sort objectives with default field and direction
      this.setState({
            usersData: data
          });
    }.bind(this));

    // get all tags
    axios({
      method: 'post',
      url: 'https://capstone-strategic-planning.herokuapp.com/get_all_tags',
    })
    .catch(function (error) {
    // handle error
      alert(error);
    })
    .then(function (res) {
      let data = res.data;
      // sort objectives with default field and direction
      this.setState({
            tagsData: data
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

    while(!isLoaded) {
      return <div className={classes.loadingRoot}>
        <CircularProgress />
      </div>
    }
    //

    const clearTagAndUsers = () => {
      this.setState({
        tagsSelected: [],
        usersSelected: []
      })
    }
    const openAddEditor = () => {
      this.setState({
        openAdd: true
      });
    };

    const closeAddEditor = () => {
      this.setState({
        openAdd: false
      });
      clearTagAndUsers();
    };

    const openEditor = objective => {
      let assignedUsers = objective.assignedUsers.map((email)=>getUser(email))
      this.setState({
        openEdit: true,
        objective: objective,
        tagsSelected: objective.tags,
        usersSelected: objective.assignedUsers ? assignedUsers : null
    })
  }

    const addNewObjective = event => {
      event.preventDefault();
      let assignedUsers = [];
      for(var i = 0; i < this.state.usersSelected.length; i++) {
        assignedUsers.push(this.state.usersSelected[i].email);
      }
      let newObjective = {
          name: event.target.elements.title.value,
          goalId: this.goalId,
          tags: this.state.tagsSelected,
          assignedUsers: assignedUsers,
          startDate: event.target.elements.startDate.value,
          endDate: event.target.elements.dueDate.value,
          description: "adhasd",
          status: 0
      }
      axios({
      method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/create_objective',
        data:  newObjective
      })
      .catch(function (error) {
      // handle error
        alert(error);
      })
      .then(function (res) {
        let responseData = res.data;
        // add objectiveId to the previously created objective object
        newObjective.objectiveId = responseData.objectiveId;
        data.objectives.push(newObjective);
        //setting the state "refreshes the page"
        //when you set state, it calls render() again
        this.setState({
            isLoaded: true,
            data: data
          });
        closeAddEditor();
      }.bind(this));
    };

    const editObjective = event => {
      event.preventDefault();

      let assignedUsers = [];
      for(var i = 0; i < this.state.usersSelected.length; i++) {
        assignedUsers.push(this.state.usersSelected[i].email);
      }
      let deets = event.target.elements;
      const objective = {
        objectiveId : this.state.objective.objectiveId,
        name: event.target.elements.title.value,
        startDate: event.target.elements.startDate.value,
        endDate: event.target.elements.dueDate.value,
        tags: this.state.tagsSelected,
        assignedUsers: assignedUsers,
        status: this.state.objective.status,
        goalId: this.state.objective.goalId,
        description: "fsdf",
      }
      axios({
        method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/update_objective',
        data: objective
      })
      .catch(function (error) {
      // handle error
        alert(error);
      })
      .then(function (res) {
        let resdata = res.data;

        let newData = this.state.data;
        let objIndex = newData.objectives.findIndex((obj => obj.objectiveId == objective.objectiveId));

        newData.objectives[objIndex] = objective;
        this.setState({
              isLoaded: true,
              data: newData
            });
        this.closeEditor()
      }.bind(this));
    }

    const actuallyDeleteObjective = event => {
      event.preventDefault();

      const objective = this.state.objective;
      axios({
        method: 'post',
        url: 'https://capstone-strategic-planning.herokuapp.com/delete_objective',
        data: {
          objectiveId: objective.objectiveId
        }
      })
      .catch(function (error) {
        alert(error);
      })
      .then(function (res) {
        let data = res.data;
        let newData = this.state.data;
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

    const Tags = this.state.tagsData ? this.state.tagsData.tags : [];
    Tags.sort();
    const Users = this.state.usersData ? this.state.usersData.users : [];
    // sort by first name, then last name
    Users.sort((a,b)=>a.fname.localeCompare(b.fname) ? a.fname.localeCompare(b.fname) : a.fname.localeCompare(b.fname)+a.lname.localeCompare(b.lname))
    // function to return user object from email
    const getUser = email => {
      let idx = Users.findIndex((user => user.email === email))
      if(idx == -1){
        return {fname: "", lname: "", email: email}
      }
      else{ return Users[idx] };
    }

    const objectivesData = data.objectives;
    // get all tags from this page's objectives
    let allTags = []
    for(let i=0; i<objectivesData.length; i++){
      let objectiveTags = objectivesData[i].tags
      // error handling
      if(objectiveTags == null){
        continue;
      }
      for(let j=0; j<objectiveTags.length; j++){
        if(allTags.indexOf(objectiveTags[j])==-1){
          allTags.push(objectiveTags[j]);
        }
      }
    }
    // check for any tags from objectives that has been recently deleted
    const filterTags = this.state.filterTags
    for(let i=0; i<filterTags.length; i++){
      if(allTags.indexOf(filterTags[i])==-1){
        allTags.push(filterTags[i]);
      }
    }
    allTags.sort();

    // function to be called when you click on a filter tag
    const addFilterTag = (tag) => {
      let newFilterTags = this.state.filterTags
      let idx = newFilterTags.indexOf(tag)
      if(idx === -1){
        newFilterTags.push(tag)
      }
      else{
        newFilterTags.splice(idx, 1)
      }
      this.setState({
        filterTags: newFilterTags
      })
    }
    const addFilterStatus = (status) => {
      let newStatusTags = this.state.filterStatus
      newStatusTags[status] = !newStatusTags[status]
      this.setState({
        filterStatus: newStatusTags
      })
    }

    // chips to display at the top of the page
    const TagChips = allTags.map(tag => (
                        <Chip clickable label={tag} color={this.state.filterTags.indexOf(tag)===-1 ? 'default' : 'primary'} onClick={()=>addFilterTag(tag)}/>
                      ))
    const statuses = [0,1,2]
    const statusesText = ["Not Started", "In Progress", "Done"]
    const StatusChips = statuses.map(status => (
                            <Chip clickable label={statusesText[status]} color={this.state.filterStatus[status] ? 'primary' : 'default'} onClick={()=>addFilterStatus(status)}/>
                          ))

    // filter objectivesData
    // tags first
    // const filterTags = this.state.filterTags; // already declared above
    let filteredObjectives = [];
    if(filterTags.length>0){
      loop1:
      for(let i=0; i<objectivesData.length; i++){
        loop2:
        for(let j=0; j<filterTags.length; j++){
          loop3:
          for(let k=0; k<objectivesData[i].tags.length; k++){
            if(objectivesData[i].tags[k]==filterTags[j]){
              if(j==filterTags.length-1){
                filteredObjectives.push(objectivesData[i]);
              }else{
                continue loop2;
              }
            }
          }
          break loop2;
        }
      }
    }else{
      filteredObjectives = objectivesData;
    }
    // then status
    const filterStatus = this.state.filterStatus;
    let filteredObjectives2 = []
    const statusFilterApplied = !filterStatus.every((status)=>status===false)
    if(statusFilterApplied){
      loop1:
      for(let i=0; i<filteredObjectives.length; i++){
        loop2:
        for(let j=0; j<filterStatus.length; j++){
          if(filterStatus[j] && filteredObjectives[i].status==j){
            filteredObjectives2.push(filteredObjectives[i]);
            continue loop1;
          }
        }
      }
    }
    else{
      filteredObjectives2 = filteredObjectives
    }

    const ObjectiveRows = filteredObjectives2.map(objective => (
                        <ObjectiveRow key={objective.id} objective={objective} openEditor={openEditor} deleteObjective={this.deleteObjective} toggleStatus={this.toggleStatus} onClickTag={addFilterTag}/>
                        ))


    return (
      <div className={classes.root}>
        <div className={classes.contentTable}>
        <div>
          <Card>
            <CardHeader
              title="Your Objectives"
            />
            <CardContent>
              <Button 
                startIcon={<FilterListIcon />} 
                onClick={()=>this.setState({showFilters:!this.state.showFilters})}
                color={this.state.filterTags.length>0 || statusFilterApplied ? "secondary" : "default"}
              >
                FILTERS
              </Button>
              <Collapse in={this.state.showFilters}>
                <Typography>
                Tags: {TagChips}
                </Typography>
                <Typography>
                Status: {StatusChips}
                </Typography>
                <Button 
                  startIcon={<ClearAllIcon />}
                  disabled={!(this.state.filterTags.length>0 || statusFilterApplied)}
                  onClick={()=>this.setState({filterTags:[],filterStatus:[false,false,false]})}
                >
                  Clear Filters
                </Button>
              </Collapse>
            </CardContent>
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
                  <Autocomplete
                    onChange={(event,value)=>this.setState({
                        usersSelected: value
                      })}
                    multiple
                    id="people"
                    defaultValue={this.state.usersSelected ? this.state.usersSelected : []}
                    options={Users}
                    getOptionLabel={(option) => option ? option.fname + " " + option.lname + " (" + option.email +")" : ""}
                    renderOption ={(option) => {
                      return <React.Fragment>
                          <span>{option.fname} {option.lname} <span style={{color:"grey", fontStyle:"italic"}}>{option.email}</span></span>
                        </React.Fragment>
                    }}
                    filterSelectedOptions
                    noOptionsText = "No user found"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="newPeople"
                        name="newPeople"
                        margin="dense"
                        variant="outlined"
                        label="People"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    onChange={(event,value)=>this.setState({
                        tagsSelected: value
                      })}
                    multiple
                    id="tags"
                    defaultValue={this.state.tagsSelected ? this.state.tagsSelected : []}
                    options={Tags}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="newTag"
                        name="newTag"
                        margin="dense"
                        variant="outlined"
                        label="Tags"
                        fullWidth
                      />
                    )}
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
                  <Autocomplete
                    onChange={(event,value)=>this.setState({
                        usersSelected: value
                      })}
                    multiple
                    id="people"
                    options={Users}
                    getOptionLabel={(option) => option.fname + " " + option.lname + " (" + option.email +")"}
                    renderOption ={(option) => {
                      return <React.Fragment>
                          <span>{option.fname} {option.lname} <span style={{color:"grey", fontStyle:"italic"}}>{option.email}</span></span>
                        </React.Fragment>
                    }}
                    filterSelectedOptions
                    noOptionsText = "No user found"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="newPeople"
                        name="newPeople"
                        margin="dense"
                        variant="outlined"
                        label="People"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    onChange={(event,value)=>this.setState({
                        tagsSelected: value
                      })}
                    multiple
                    id="tags"
                    options={Tags}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="newTag"
                        name="newTag"
                        margin="dense"
                        variant="outlined"
                        label="Tags"
                        fullWidth
                      />
                    )}
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

export default withStyles(classes)(withRouter(MyObjectives));
