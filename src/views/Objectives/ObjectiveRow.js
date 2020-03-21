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
		switch(objective.completion) {
		  case "Done":
		    color = "green";
		    break;
		  case "In Progress":
		    color = "yellow";
		    break;
		  case "Not Started":
		    color = "red";
		}
		return(
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
	          	<Button
	          		style={{color: color}}
	          		onClick = {() => this.onProgressClick(objective)}
	          	>
	            	{objective.completion}
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