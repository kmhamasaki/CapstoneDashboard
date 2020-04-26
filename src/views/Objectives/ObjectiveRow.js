import React from 'react';
import {
  Chip,
  Button,
  IconButton,
  TableCell,
  TableRow,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/styles';


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
		    completionText = "Done";
		    break;
		  default:
		  	color = "grey";
		  	completionText = "null";
		}
		if(objective.tags){
			objective.tags.sort();
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
	          <TableCell>{objective.assignedUsers.map(tag=>(<Chip style={{margin: "2px"}} label={tag} />) )}</TableCell>
	          <TableCell>{objective.tags.map(tag=>(<Chip style={{margin: "2px"}} clickable label={tag} onClick={()=>this.props.onClickTag(tag)} />) )}</TableCell>
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