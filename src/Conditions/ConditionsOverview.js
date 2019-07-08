import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TopAppBar from '../Navigation/TopAppBar'

import { searchconditionsQuery } from './Queries';

const drawerWidth = 230;
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
  info: {
    padding: theme.spacing.unit * 2,
  }
});
   
const MyDashBoard = props => {
  const { classes } = props;
  const [hits, setHits] = useState([])
  useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{conditionmeddracode: props.condition}}
    const parameters = objb
    session
    .run(searchconditionsQuery, parameters)
    .then (recs => {
      if (isSubscribed) {
        const response = {recs}
        setHits(response.recs.records.map((item, i) => item._fields).map(
          ([selectedcondition]) => ({selectedcondition})
        ).map((item, i) => item.selectedcondition.properties))
        }
      })
    .catch(function (error) 
    {console.log(error); 
    session.close();});  
    return () => isSubscribed = false
    }, [props.neo4j, props.condition])
    if (!props.condition) 
    return (
    <>
    <TopAppBar /> 
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawer,
    })}> Please search for a condition
    </div>
    </>
    )
    if (hits[0] === undefined && props.condition) 
      return (  
      <>
      <TopAppBar />   
      <div className={clsx(classes.content, {
        [classes.contentShift]: props.drawer,
      })}>Loading...
      </div>
      </>
      )
  return (
    <>
    <TopAppBar />
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawer,
    })}>
    <Grid container spacing={10} >
      <Grid item md={6}>
          <Paper > 
              <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Condition Info</Typography>
              <List >
                <ListItem>
                  <Avatar>
                    <ConditionIcon /> 
                  </Avatar> 
                  <ListItemText className={classes.info} 
                  primary={hits[0].pt_name} 
                  secondary={hits[0].soc_name}/>
                </ListItem>
              </List>
          </Paper>
      </Grid>
      <Grid item md={12}>
          <Paper > 
              <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Diagnosed Patients</Typography>
              Sorteable Table
              Patient name
              Age
              City
              Current Tratments
              Last visit date
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
    width: state.width,
    neo4j: state.dbserver,
    condition: state.condition
  }
}
export default connect (mapStatetoProps)(withStyles(styles) (MyDashBoard))