import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import { updatepatientQuery, getpatientinfoQuery, newpatientidQuery, addpatientQuery } from './Queries';

const genders = [
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const maritalstatus = [
  {
    value: 'married',
    label: 'Married'
  },
  {
    value: 'single',
    label: 'Single'
  },
  {
    value: 'divorced',
    label: 'Divorced'
  },
  {
    value: 'separated',
    label: 'Separated'
  },
  {
    value: 'widow',
    label: 'Widow'
  },
];

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper * 1,
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
  },
  menu: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});
   
const EditPatientInfo = (props) => {
  const { classes } = props;
  const [hits, setHits] = useState([])

  const calculateAge = (dob) => {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
    }

   useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{patientuuid: props.patient}}
    const parameters = objb
    props.addPatient ?
    session 
    //change query to get a new patient ID
    .run(newpatientidQuery, parameters)
    .then( recs =>  {
      if (isSubscribed) {
        const response = {recs}
        setHits(response.recs.records.map((item, i) => item._fields).map(([id]) => ({id}))[0])
        }
      }) 
    .catch( function (error) 
    { console.log(error) 
    session.close()}
    )    
    :
    session 
    .run(getpatientinfoQuery, parameters)
    .then (recs => {
      if (isSubscribed) {
        const response = {recs}
        setHits(response.recs.records.map((item, i) => item._fields).map(
          ([selectedpatient]) => ({selectedpatient})
        ).map((item, i) => item.selectedpatient.properties)[0])
      }
    })
    .catch(function (error) 
    {console.log(error); 
    session.close();})
    return () => isSubscribed = false 
    }, [props]) 

      const handleChange = (name) => event => {
        setHits({ ...hits, 
            [name]: event.target.value, 
        });    
      };

      const handledobestimateChange = name => event => {
        setHits({ ...hits, [name]: event.target.checked });
      }; 

  function determinepatientid (props, hits) {
    if (props.addPatient && hits.id) return (
      hits.id+1
    )
    if (hits.id) return (
      hits.id
    )
    return ''
  }
  
  return (
    <>
    <form noValidate autoComplete="off">
    <Grid container>
      <Grid item lg={3}>
        <TextField 
        id="id"
        label="ID"
        className={classes.textField}
        //add 1 number to the last ID if the form is for a new patient
        value={determinepatientid(props, hits)} 
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={{
          readOnly: true,
        }}
        />
        <TextField 
        id="first-name"
        label="First Name"
        required
        className={classes.textField}
        value={hits.first_name ? hits.first_name: ''}
        onChange={handleChange('first_name')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
        <TextField 
        id="outlined-name"
        label="Last Name"
        className={classes.textField}
        value={hits.last_name ? hits.last_name : ''}
        onChange={handleChange('last_name')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
        <TextField 
        id="clan_name"
        label="Clan Name"
        className={classes.textField}
        value={hits.clan_name ? hits.clan_name : ''}
        onChange={handleChange('clan_name')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
    </Grid>
    <Grid item lg={3}>
        <TextField 
        id="fame_number"
        label="FAME Number"
        className={classes.textField}
        value={hits.fame_number ? hits.fame_number : ''}
        onChange={handleChange('fame_number')}
        margin={props.editClicked  || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
        <TextField 
        id="nssf"
        label="NSSF Number"
        className={classes.textField}
        value={hits.nssf_number ? hits.nssf_number : ''}
        onChange={handleChange('nssf_number')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
    <TextField 
        id="phone_number"
        label="Phone Number"
        className={classes.textField}
        value={hits.phone_number ? hits.phone_number : ''}
        onChange={handleChange('phone_number')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        helperText="example: +255 000 000 000"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
      <TextField
          id="birthday"
          label="Birthday"
          margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
          type='date'
          variant="outlined"
          helperText={props.editClicked ? "mm-dd-yyyy" : <>{hits.dob_estimate ? 'Age: ' + calculateAge(hits.dob) + ' (est)' : 'Age: ' + calculateAge(hits.dob) }</>}
          value={hits.dob ? hits.dob : ''}
          required
          className={classes.textField}
          InputLabelProps={{
          shrink: true,
          }}
          InputProps={props.editClicked || props.addPatient ? {
            readOnly: false,
          }: {
            readOnly: true,
          }}
          onChange={handleChange('dob')}
          />
        <FormControlLabel
        label='Estimated  '
        control={
        <Tooltip
        title="check this box if birthdate is an estimated date"
        >
          <Checkbox 
          id='est'
          label='Estimate?'
          color="default"
          checked={hits.dob_estimate==='true' || hits.dob_estimate===true}
          onChange={handledobestimateChange('dob_estimate')}
          disabled={!props.editClicked && !props.addPatient === true}
          />
        </Tooltip>
        }
        />
    </Grid>
    <Grid item lg={3}>
    <TextField
          id="outlined-select-gender"
          select
          label="Gender"
          className={classes.textField}
          value={hits.sex ? hits.sex : ''}
          onChange={handleChange('sex')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          InputProps={props.editClicked || props.addPatient ? {
            readOnly: false,
          }: {
            readOnly: true,
          }}
          helperText="Select Patient Gender"
          margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
          variant="outlined"
        >
          {genders.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
    </TextField>
    <TextField 
        id="marital_status"
        select
        label="Marital Staus"
        helperText="Select Marital Status"
        className={classes.textField}
        value={hits.marital_status ? hits.marital_status : ''}
        onChange={handleChange('marital_status')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        >
          {maritalstatus.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          }
      </TextField>
    <TextField 
        id="ocupation"
        label="Occupation"
        className={classes.textField}
        value={hits.ocupation ? hits.ocupation : ''}
        onChange={handleChange('ocupation')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
    <TextField 
        id="next_o_fkin"
        label="Next of Kin"
        className={classes.textField}
        value={hits.next_o_fkin? hits.next_o_fkin : ''}
        onChange={handleChange('next_o_fkin')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
    </Grid>
    <Grid item lg={3}>
    <TextField 
        id="next_of_kin_contact"
        label="Next of Kin Contact"
        className={classes.textField}
        value={hits.next_of_kin_contact ? hits.next_of_kin_contact : ''}
        onChange={handleChange('next_of_kin_contact')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
    <TextField 
        id="address"
        label="Address"
        className={classes.textField}
        value={hits.address ? hits.address : ''}
        onChange={handleChange('address')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
    <TextField 
        id="city"
        label="City"
        className={classes.textField}
        value={hits.city ? hits.city : ''}
        onChange={handleChange('city')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
      <TextField 
        id="country_code"
        label="Country"
        className={classes.textField}
        value={hits.country_code ? hits.country_code: ''}
        onChange={handleChange('country_code')}
        margin={props.editClicked || props.addPatient ? 'normal' : 'dense'}
        variant="outlined"
        InputProps={props.editClicked || props.addPatient ? {
          readOnly: false,
        }: {
          readOnly: true,
        }}
        />
    </Grid>
    </Grid>
        </form>
      <>
        { props.editClicked  ? 
          <>
          <Button color='primary' variant="contained" 
            onClick={() => {(updatepatientQuery(props, hits)); (props.onSave(false))}}>
            <SaveIcon style={{marginLeft: '-2px', marginRight: '3px'}}/>
            Save
          </Button> </> : null

        }
        {props.addPatient ?
        <>
        <Button color='primary' variant="contained" 
        onClick={() => {(addpatientQuery(props, hits)); (props.onSave(false))}}>
        <SaveIcon style={{marginLeft: '-2px', marginRight: '3px'}}/>
        Save
        </Button> </> : null
        }
        &nbsp;
        { props.editClicked || props.addPatient ? <Button style={{color: 'grey'}} color='inherit' variant="outlined" onClick={() => (props.onSave(false))}><CancelIcon style={{marginLeft: '-2px', marginRight: '3px'}}/>Cancel</Button> : null}
      </>
    </>
  )
}
const mapStatetoProps = (state) => {
 return {
    drawer: state.drawer,
    neo4j: state.dbserver,
    patient: state.patient
  }
}
export default connect (mapStatetoProps)(withStyles(styles) (EditPatientInfo))