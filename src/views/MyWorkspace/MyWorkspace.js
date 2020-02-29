import React, { useCallback, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, 
  IconButton, 
  Card, 
  CardContent,
  Typography, 
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core';
import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders
} from './components';
import { withRouter} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  cardRoot: {
    height: '100%',
    alignItems: 'center',

  },
  content: {
    alignItems: 'center',
    display: 'flex',
    alignContent: 'center',
    justify:"center",

  },
  title: {
    fontWeight: 700,
    align: 'center',
  },
  addIcon: {
    height: 32,
    width: 32
  },
  cardContent: {
    alignContent: 'center',
  }
}));

const MyWorkspace = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCreate = () => {
    //dosomething here
  };

  const workplaceHandleClick = event => {
      //const { title } = event.target.elements;
      //alert(title);
      //setOpen(false);
  };
  const classes = useStyles();
  let strategies = [
  {
    name: "Stategy 0",
    progress: 50,
    id: 0,
  },
  {
    name: "Stategy 1",
    progress: 90,
    id: 1,
  },
  {
    name: "Stategy 2",
    progress: 20,
    id: 2,
  },
  {
    name: "Stategy 2",
    progress: 43,
    id: 3,
  }
  ];

  var cards=[];

  for(var i=0;i<strategies.length;i++){
    // push the component to elements!
    cards.push(<TasksProgress strategy={ strategies[i] } />);
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        {cards}
         <Grid
          item
          lg={4}
          sm={6}
          xl={4}
          xs={12}
        >
          <Card className={classes.cardRoot}>
            <CardContent className={classes.cardContent}>
              <Grid
                container
                className = {classes.content}
              >
                <Grid item>
                  <IconButton aria-label="add" onClick={handleClickOpen}>
                    <AddIcon className={classes.addIcon} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottoms
                    variant="h1"
                  >
                  Add Strategy
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Strategy</DialogTitle>
        <DialogContent>
          <form
            className={classes.form}
            onSubmit={workplaceHandleClick}
          >
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
            />
          <Button color="primary" type="submit">
            Subscribe
          </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(MyWorkspace);
