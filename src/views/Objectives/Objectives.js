
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { withRouter} from 'react-router-dom';
import { withStyles } from '@material-ui/styles';

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
      open: false
    };
  }

  componentWillMount() {
    axios({
      method: 'get',
      url: 'http://localhost:4000/get_my_objectives',
      data: {
        userId: 1,
        goalId: 2
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

  render(){
    const { error, isLoaded, data } = this.state;
    const { classes } = this.props;

    console.log(classes);

    while(!isLoaded) {
      return <div>not here</div>
    }

    const handleClickOpen = () => {
      this.setState({
        open: true
      });
    };
    console.log(data);
    let objectives = data;
    const handleClose = () => {
      this.setState({
        open: false
      });
    };
    const handleCreate = () => {
      //dosomething here
    };

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
                        <TableCell >Completion</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {objectives.map(objective => (
                        <TableRow
                          hover
                          key={objective.id}
                        >
                          <TableCell>
                            {objective.title}
                          </TableCell>
                          <TableCell>{objective.startDate}</TableCell>
                          <TableCell>
                            {objective.dueDate}
                          </TableCell>
                          <TableCell>{objective.people}</TableCell>
                          <TableCell>{objective.tags}</TableCell>
                          <TableCell>
                            {objective.completion}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </PerfectScrollbar>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    )
  }
}

export default withStyles(classes)(withRouter(Objectives));
