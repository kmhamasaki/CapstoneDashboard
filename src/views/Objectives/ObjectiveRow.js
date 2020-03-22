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
		this.state = {
			open: false
		}
	}
    onProgressClick = (objective) => {
    	console.log(objective);
    }

	render(){
		const openEditor = () => {
		  this.setState({
		    open: true
		  });
		};

		const closeEditor = () => {
		  this.setState({
		    open: false
		  });
		};

		const objective = this.props.objective

		let color = "white";
		let completionText = "";
		switch(objective.status) {
		  case 0:
		    color = "red";
		    completionText = "Not Started";
		    break;
		  case 1:
		    color = "yellow";
		    completionText = "In Progress";
		    break;
		  case 2:
		    color = "green";
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
	          		onClick = {() => this.onProgressClick(objective)}
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
				<IconButton aria-label="delete">
				  <DeleteIcon />
				</IconButton>
	          </TableCell>
	        </TableRow>
	       

		)
	}
}

export default ObjectiveRow