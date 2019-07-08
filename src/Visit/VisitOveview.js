import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import clsx from 'clsx';
import TopAppBar from '../Navigation/TopAppBar';
import TextField from '@material-ui/core/TextField';
import EditConditions from './Conditions/DiagnosedConditions';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import VisitInfo from './VisitInfo';
import { editvisitQuery } from './Queries';
import EditTreatments from './Treatments/PrescribedTreatments';
import Vitals from './Vitals/Vitals';

const drawerWidth = 230;
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper * 1,
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
    marginLeft: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '75%',

  },
  menu: {
    width: 300,
  },
});
   
const EditVisitInfo = props => {
  const { classes } = props;
  const [hits, setHits] = useState([])
  const [patienthits, setPatientHits] = useState([])
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{visituuid: props.visit}}
    const parameters = objb
    session 
    .run(editvisitQuery, parameters)
    .then (recs => {
      if (isSubscribed) {
        const response = {recs}
        setHits(response.recs.records.map((item, i) => item._fields).map(
          ([selectedvisit]) => ({selectedvisit})
        ).map((item, i) => item.selectedvisit.properties)[0])
        setPatientHits(response.recs.records.map((item, i) => item._fields).map(
            ([selectedvisit, selectedpatient]) => ({selectedvisit, selectedpatient})
          ).map((item, i) => item.selectedpatient.properties)[0])
      }
        })
    .catch(function (error) 
    {console.log(error); 
    session.close();});
    return () => isSubscribed = false  
    }, [props])

    if (!props.visit) 
    return (
    <>
    <TopAppBar /> 
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawer,
    })}> Please search for a visit
    </div>
    </>
    )
    if (hits === undefined && props.visit) 
      return (  
      <>
      <TopAppBar />   
      <div className={clsx(classes.content, {
        [classes.contentShift]: props.drawer,
      })}>Loading...
      </div>
      </>
      )

      const handleChange = (name) => event => {
        setHits({ ...hits, 
            [name]: event.target.value, 
        }) 
      };
  
  function updateEdit (value) {
    setEdit(value)
  }
   
  return (
    <>
    <TopAppBar />
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawer,
    })}>
      <form noValidate autoComplete="off">
        <Grid container spacing={4}>
          <Grid item lg={3} className={classes.root}>
            <Paper style={{padding:'8px'}}> 
              <Grid container justify='space-between' alignItems='center' alignContent='center'>
                <Typography style={{marginLeft: '30%', marginTop:'2px'}} variant="h6" paragraph color='textSecondary' align= 'center' >Visit Info</Typography>
                {!edit? <IconButton color="default" onClick={() => (setEdit(true))}> <EditIcon /></IconButton> : null}  
              </Grid>
              <Grid container>
                <Typography variant="subtitle1" paragraph  color={'textPrimary'} align= 'left' >Patient: &nbsp;</Typography>
                <Typography variant="subtitle1" paragraph gutterBottom color='textSecondary' align= 'left' >{patienthits.first_name + ' ' + patienthits.last_name}</Typography>
              </Grid>
                  <VisitInfo {...props} edit={edit} hits={hits} update={updateEdit}/>
              </Paper > 
            </Grid>
              <Grid item lg={9} className={classes.root}>
                  <Paper style={{padding: '10px', width: '100%', flexGrow: 1}}>
                      <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Diagnosed conditions</Typography>
                          <EditConditions />
                  </Paper>
              </Grid>
            </Grid>
            < Grid container spacing={4}>
            <Grid item lg={3} className={classes.root}>
                  <Paper style={{padding: '10px', width: '100%', flexGrow: 1}}>
                      <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Vitals measured</Typography>
                      <Vitals {...props} />
                  </Paper>
              </Grid>     
              <Grid item lg={9}>
                  <Paper style={{padding: '10px', width: '100%', flexGrow: 1}} >
                      <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Prescribed treatments</Typography>
                      <EditTreatments {...props}/>
                  </Paper>
                  <br />
                  <Paper style={{padding: '10px', width: '100%', flexGrow: 1}} >
                    <TextField
                    id="notes"
                    label="Notes"
                    margin="normal"
                    multiline
                    rows='5'
                    fullWidth
                    variant="outlined"
                    value={hits.notes}
                    onChange={handleChange('notes')}
                    style={{padding: '5px'}}
                    />
                  </Paper>
              </Grid>     
            </Grid>
        </form>
      </div>
    </>
  )
}
const mapStatetoProps = state => {
  return {
    drawer: state.drawer,
    neo4j: state.dbserver,
    visit: state.visit
  }
}
export default connect (mapStatetoProps)(withStyles(styles) (EditVisitInfo))