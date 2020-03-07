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
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { withRouter, useParams} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/styles';
import objectivesData from './ObjectivesList.js'
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
      openAdd: false
    };

    // this is how you get the url parameter
    this.goalId = props.match.params.id;

    this.openEditor = this.openEditor.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
  }

  openEditor(objective){
    console.log(objective)
    this.setState({
      openEdit: true,
      objective: objective
    })
  }
  closeEditor(){
    this.setState({
      openEdit: false,
    })
  }

  // componentWillMount() {
  //   axios({
  //     method: 'get',
  //     url: 'http://localhost:4000/get_my_objectives',
  //     data: {
  //       userId: 1,
  //       goalId: this.id
  //     }
  //   })
  //   .catch(function (error) {
  //   // handle error
  //     alert(error);
  //   })
  //   .then(function (res) {
  //     console.log(res);
  //     let data = res.data;
  //     this.setState({
  //           isLoaded: true,
  //           data: data
  //         });
  //   }.bind(this));

  // };



  render(){
    const { error, isLoaded, data } = this.state;
    const { classes } = this.props;

    console.log(classes);

    console.log(objectivesData)

    // while(!isLoaded) {
    //   return <div>not here</div>
    // }

    const openAddEditor = () => {
      this.setState({
        openAdd: true
      });
    };
    console.log(data);
    let objectives = data;
    const closeAddEditor = () => {
      this.setState({
        openAdd: false
      });
    };
    const handleCreate = () => {
      //dosomething here
    };

    const addNewObjective = () => {
      console.log("new!")
    }

    const editObjective = () => {
      console.log("edit!")
    }

    const ObjectiveRows = objectivesData.map(objective => (
                        <ObjectiveRow objective={objective} openEditor={this.openEditor}/>
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
                        <TableCell>Title</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>People</TableCell>
                        <TableCell>Tags</TableCell>
                        <TableCell>Completion</TableCell>
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
        <Dialog open={this.state.openEdit} onClose={this.closeEditor} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Objective</DialogTitle>
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
                    defaultValue={this.state.objective ? this.state.objective.title : ""}
                    fullWidth
                  />
                  <DatePicker startDate={this.state.objective ? this.state.objective.startDate : ""}
                  dueDate={this.state.objective ? this.state.objective.dueDate : ""}/>
                  <TextField
                    id="people"
                    margin="dense"
                    name="people"
                    label="People"
                    multiline
                    variant="outlined"
                    defaultValue={this.state.objective ? this.state.objective.people : ""}
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
        <Dialog open={this.state.openAdd} onClose={closeAddEditor} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Create New Objective</DialogTitle>
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
      </div>
    )
  }
}

export default withStyles(classes)(withRouter(Objectives));
