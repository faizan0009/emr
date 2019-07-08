import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import TopAppBar from '../Navigation/TopAppBar';
import EditIcon from '@material-ui/icons/Edit';
import { withRouter } from 'react-router-dom';

import MedicalHistory from './MedicalHistory';
import Visits from './Visits';
import EditPatientInfo from './EditPatientInfo';
import { patientovervirewQuery } from './Queries';

const drawerWidth = 230;
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper * 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing( 5, 1, 1, 32),
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
    marginLeft: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});
   
const PatientOverview = props => {
  const { classes } = props;
  const [hits, setHits] = useState([])
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{patientuuid: props.patient}}
    const parameters = objb
    const patientOverview = session.writeTransaction(tx => tx.run(patientovervirewQuery, parameters))
    patientOverview.then(result => {
      if (isSubscribed) {
      const response = {result}
      setHits(response.result.records.map((item, i) => item._fields).map(
      ([selectedpatient]) => ({selectedpatient})
      ).map((item, i) => item.selectedpatient.properties)[0])
    }
    })
    .catch(function (error) 
      {console.log(error); 
        session.close();
    });
    return () => isSubscribed = false
    }, [props.neo4j, props.patient, edit])
    if (!props.patient) 
    return (
    <>
    <TopAppBar /> 
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawer,
    })}> Please search for a patient
    </div>
    </>
    )
    if (hits === undefined && props.patient) 
      return (  
      <>
      <TopAppBar />   
      <div className={clsx(classes.content, {
        [classes.contentShift]: props.drawer,
      })}>Loading...
      </div>
      </>
      )
    function handleEditSave () {
      setEdit(false)
    }
  return (
    <>
    <TopAppBar />
    <div className={clsx(classes.content, {[classes.contentShift]: props.drawer})}>
    <Grid container spacing={4} justify='center' >
      <Grid item lg={9} className={classes.root}>
        <Paper style={{padding: '10px'}}>
          <Grid container justify='space-between' alignItems='center' alignContent='center'>
          <Typography  style={{marginLeft: '50%'}} variant="h6" paragraph color='textSecondary' align= 'center'> Patient Info </Typography>
          {!edit? <IconButton color="default" onClick={() => (setEdit(true))}> <EditIcon /></IconButton> : null}
          </Grid>
          <EditPatientInfo {...props} editClicked={edit} onSave={handleEditSave}/>
        </Paper>
      </Grid>
      <Grid item lg={3} className={classes.root}>
          <Paper > 
            <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Active Conditions and Treatments</Typography>
              <MedicalHistory className={props.classes.info} noWrap />
          </Paper>
      </Grid>
      <Grid item lg={9} className={classes.root}>
        <Visits />
      </Grid>
      <Grid item lg={3} className={classes.root}>
        <Paper > 
          <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Patient Files</Typography>
        </Paper > 
      </Grid>
    </Grid>
    </div>
    </>
  )
}
const mapStatetoProps = state => {
  return {
    drawer: state.drawer,
    neo4j: state.dbserver,
    patient: state.patient
   }
}
export default connect (mapStatetoProps)(withStyles(styles) (withRouter(PatientOverview)))