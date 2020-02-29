
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
import { withRouter} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
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
}));

let objectives = [
{
  title: "Objective 0",
  startDate: "4/1/20",
  dueDate: "1/10/20",
  people: "Kristyn",
  tags: "Tag 1",
  completion: "Done",
  id: 0,
},
{
  title: "Objective 1",
  startDate: "1/1/20",
  dueDate: "2/30/20",
  people: "Kristyn",
  tags: "Tag 1",
  completion: "Done",
  id: 1,
},
{
  title: "Objective 2",
  startDate: "1/1/20",
  dueDate: "2/3/20",
  people: "Kristyn",
  tags: "Tag 1",
  completion: "Done",
  id: 2,
},
{
  title: "Objective 3",
  startDate: "3/1/20",
  dueDate: "9/10/20",
  people: "Kristyn",
  tags: "Tag 1",
  completion: "Done",
  id: 3,
},
{
  title: "Objective 4",
  startDate: "9/13/20",
  dueDate: "9/21/20",
  people: "Kristyn",
  tags: "Tag 1",
  completion: "Done",
  id: 4,
},
];
const Objectives = props => {
  const classes = useStyles();

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
  );
};


export default withRouter(Objectives);
