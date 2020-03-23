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
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import { withRouter, useParams} from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/styles';
import objectivesData from './ObjectivesList.js'



class ObjectiveRow extends React.Component{
	constructor(props){
		super(props)
		let mystatus = props.objective.status;
	}
    onProgressClick = (objective) => {
    	let newStatus = 0;
    	switch(this.state.status) {
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
	      this.setState({
	            status: newStatus
	          });
	    }.bind(this));
    }

	render(){

		const objective = this.props.objective

		let color = "white";
		let completionText = "";
		let status = objective.status;
		switch(status) {
		  case 0:
		    color = "firebrick";
		    completionText = "Not Started";
		    break;
		  case 1:
		    color = "goldenrod";
		    completionText = "In Progress";
		    break;
		  case 2:
		    color = "seagreen";
		    completionText = "Done"
		}
		return(
			<TableRow
	          hover
	          key={objective.id}
	        >
	          <TableCell>
	            {objective.name}
	          </TableCell>
	          <TableCell>{objective.startDate}</TableCell>
	          <TableCell>
	            {objective.endDate}
	          </TableCell>
	          <TableCell>{objective.assignedUser}</TableCell>
	          <TableCell>{objective.tags}</TableCell>
	          <TableCell>
	          	<Button
	          		style={{color: color}}
	          		onClick = {() => this.props.toggleStatus(objective)}
	          	>
	            	{completionText}
	            </Button>
	          </TableCell>
	          <TableCell
	          	align="right"
	          	style={{width: 96+16+16}}
	          >
	          	<IconButton aria-label="edit" onClick={()=>this.props.openEditor(objective)}>
				  <EditIcon />
				</IconButton>
				<IconButton aria-label="delete" onClick={()=>this.props.deleteObjective(objective)}>
				  <DeleteIcon />
				</IconButton>
	          </TableCell>
	        </TableRow>
	       

		)
	}
}

export default ObjectiveRow