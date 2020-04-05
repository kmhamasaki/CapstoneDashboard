import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
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
		objective.tags.sort();
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
	          <TableCell>{objective.assignedUsers.map(tag=>(<Chip label={tag} />) )}</TableCell>
	          <TableCell>{objective.tags.map(tag=>(<Chip clickable label={tag} onClick={()=>this.props.onClickTag(tag)} />) )}</TableCell>
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