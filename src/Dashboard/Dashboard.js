import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import clsx from 'clsx';
import TopAppBar from '../Navigation/TopAppBar';

const drawerWidth = 230
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing( 5, 5, 5, 32),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

const MyDashBoard = props => {
  const { classes } = props;
  return (
  <>
  <TopAppBar />
  <div className={clsx(classes.content, {
    [classes.contentShift]: props.drawer,
  })}>
  <Grid container spacing={10} >
  <Grid item md={12}>
        <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Filters (Condition, date from, date to and Location)</Typography>
        </Paper>
    </Grid>
    <Grid item md={3}>
        <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Patient visits per month</Typography>
        </Paper>
    </Grid>
    <Grid item md={3}>
        <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Patient visits by location</Typography>
        </Paper>
    </Grid>
    <Grid item md={3}>
        <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Conditions treated</Typography>
        </Paper>
    </Grid>
    <Grid item md={3}>
        <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Conditions by gender</Typography>
        </Paper>
    </Grid>
    <Grid item md={3}>
        <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Conditions by age</Typography>
        </Paper>
    </Grid>
    <Grid item md={3}>
        <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Conditions by location</Typography>
        </Paper>
    </Grid>
  </Grid>
  </div>
  </>
  )
}
const mapStatetoProps = state => {
  return {
    drawer: state.drawer,
  }
}
export default connect (mapStatetoProps)(withStyles(styles) (MyDashBoard))