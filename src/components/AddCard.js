import React from 'react'

const AddCard = props => {

  return(<Grid
      item
      xl={4}
      lg={4}
      sm={6}
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
    </Grid>)
}