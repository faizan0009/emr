import React from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { searchdrugQuery } from '../../Queries';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 5,
    width: '100%',
    backgroundColor: 'white',
    fontWeight: 300,
    zIndex: 2,
    left: 0,
    right: 0,
  },
})

function SearchTreatment(props) {
  const [input, setInput] = React.useState(props.edit? props.edit.treatment.properties.drug_name : '')
  const [hits, setHits] = React.useState([])
  const [selected, setSelected] = React.useState(props.edit? props.edit.treatment.properties : '')
  const [open, setOpen] = React.useState(props.edit? false : true)
  const { classes } = props;

  React.useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{
        drug: input !=='' ? input : null
    }}
    const parameters = objb
    if (isSubscribed) {
        session 
    .run(searchdrugQuery, parameters)
    .then(recs => {
      setHits(recs.records.map(item => item._fields).flat())
      if (props.edit) props.oktosave(true)
    })
    .catch(function (error)
    {console.log(error); 
    session.close();});  }
    return () => isSubscribed = false 
  }, [input, props, props.neo4j])
  return (
    <Grid container >
    {props.edit ? props.updateoptions(selected) : undefined}
    <Grid item lg={6} >
      <TextField
      required
      fullWidth
      id='drug'
      label='Drug'
      value={input}
      variant='outlined'
      helperText={props.edit ? <Typography variant='caption' color='primary'>Changing the treatment name will create a new treatment</Typography> : false}
      onChange={(e) => {(setInput(e.target.value)); setOpen(true)}}  
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
              <IconButton size='small' onClick={() => {(setInput('')); setSelected({selected: ''}); (props.oktosave(false)); (props.updateoptions([]))}}>
                <CancelIcon />
              </IconButton>
          </InputAdornment>)
      }}
    /> 
    <div style={{position: 'relative', zIndex: 4, width: '200%', backgroundColor: 'white'}}>
    {open && input!=='' && input!==selected.drug_name ? 
      <Paper className={classes.suggestionsContainerOpen}>
        <Grid container> 
          <Grid item lg={4}><Typography align='center' color='textSecondary' variant='subtitle1' >Drug</Typography></Grid>
          <Grid item lg={4}><Typography align='center' color='textSecondary' variant='subtitle1'>Form</Typography></Grid>
          <Grid item lg={4}><Typography align='center' color='textSecondary' variant='subtitle1'>Route</Typography></Grid>
        </Grid>
        {hits.length === 0 ? <Grid> <Typography color='textPrimary'>no results... </Typography></Grid>: hits.map((item, i) => 
          <MenuItem key={i} onClick={() => {(setSelected(item.properties)); (props.updateoptions(item.properties)); (setInput(item.properties.drug_name)); (props.oktosave(true))}}>
            <Grid container  style={{fontSize: '10px'}}>
              <Grid  item xs={4} >
                {item.properties.drug_name.substring(0, 30)} 
              </Grid>
              <Grid item xs={4}>
                {item.properties.doseage_form.substring(0, 30)}
              </Grid>
              <Grid item xs={4}>
                {item.properties.route}
              </Grid>
            </Grid>    
          </MenuItem>
        )}
      </Paper>: null}
    </div>
    </Grid>
    <Grid item lg={3}>
      <Typography color='textSecondary' variant='subtitle1' >Form: </Typography>
      <Typography color='textPrimary' variant='subtitle1'>{props.edit? props.edit.treatment.properties.form : selected.doseage_form}</Typography>
    </Grid>
    <Grid item lg={3}>
      <Typography color='textSecondary' variant='subtitle1'>Route: </Typography>
      <Typography color='textPrimary' variant='subtitle1'>{props.edit? props.edit.treatment.properties.route : selected.route}</Typography>
      </Grid>
    </Grid>
  )
}
export default withStyles (styles) (SearchTreatment)
