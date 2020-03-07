import React from 'react'
import { withStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import { 
  Grid, 
  Card, 
  CardMedia,
  Button
} from '@material-ui/core';


const classes = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  cardRoot: {
    height: '100%',
    alignItems: 'center',
    display: 'flex'

  },
  content: {
    alignItems: 'center',
    display: 'flex',
    alignItems: 'center',
    justify:"center"
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
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%'
  },
  button: {
    width: '100%',
    height: '100%'
  }
});

class AddCard extends React.Component{

  render(){
    const { classes } = this.props;
    return(<Grid
            item
            xl={4}
            lg={4}
            sm={6}
            xs={12}
            >
            <Card className={classes.cardRoot}>
                <CardMedia className={classes.cardContent}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="default"
                    className={classes.button}
                    startIcon={<AddIcon />}
                    onClick={this.props.handleClickOpen}
                  > 
                    Add Strategy
                  </Button>
                </CardMedia>
              </Card>
            </Grid>)
  }
}


export default withStyles(classes)(AddCard)