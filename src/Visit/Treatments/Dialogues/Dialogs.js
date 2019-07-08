import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { AddTreatment, DeleteTreatment } from '../../Queries'
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';
import TreatmentsIcon from '@material-ui/icons/LocalHospitalSharp';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { DrugSwitch } from './Switches';
import SearchTreatment from './SearchTreatment';
import Grid from '@material-ui/core/Grid';
import { DialogContent } from '@material-ui/core';
import SelectCondition from './SelectCondition';
import DrugTreatmentOptions from './DrugTreatmentOptions';
import OtherTreatmentOptions from './OtherTreatmentOptions';

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  menu: {
    width: 500,
  },

})

  const AddTreatmentDialog = (props) => {
    const {onClose, selectedValue, ...other } = props;
    // eslint-disable-next-line no-unused-vars
    const [options, setOptions] = React.useState([])
    // eslint-disable-next-line no-unused-vars
    const [treatment, setTreatment] = React.useState([])
    const [allowsave, setAllowSave] = React.useState(false)
    const [allowsavecond, setAllowSaveCond] = React.useState(false)
    const [drugtreatment, setDrugTreatment] = React.useState([])
    const [condition, setCondition] = React.useState([])
    const [drugtreatmentoptions, setDrugTreatmentOptions] = React.useState([])
    const [othertreatmentoptions, setOtherTreatmentOptions] = React.useState([])

    function handleClose() {
      onClose(selectedValue);
    }

    function handleAdd () {
      AddTreatment(props, drugtreatmentoptions, condition, drugtreatment, othertreatmentoptions)
    }

    const handleDrugTreatmentSelect = ( val ) => {
      
      if (!props.edit) setDrugTreatment(val);
      else if (props.edit.treatment.properties.drug_name) setDrugTreatment(val);    
      else if (!props.edit.treatment.properties.drug_name) setDrugTreatment(false);    
      return '';
    };

    const allowSave = (oktosave) => {
      setAllowSave(oktosave)
    }

    const allowSaveCond = (oktosave) => {
      setAllowSaveCond(oktosave)
    }

    const isDrug = (on) => {
      setDrugTreatment(on)
    } 

    const getCondition = (value) => {
      setCondition(value)
    }

    const getDrugTreatmentOptions = (values) => {
      setDrugTreatmentOptions(values)
    }
    const getOtherTreatmentOptions = (values) => {
      setOtherTreatmentOptions(values)
    }

    return (
      <Dialog fullScreen onClose={handleClose} aria-labelledby="simple-dialog-title" {...other} 
      style={{width:'100%',textAlign: 'center', padding: '10px', marginLeft: '5px'}}>
        <DialogTitle id="simple-dialog-title"> {props.edit? <>Edit Treatment</> : <>Add Treatment</>}</DialogTitle>
        <DialogContent style={{position: 'relative', zIndex: 1}}> 
          {!props.edit ? <DrugSwitch {...props} controlDrugSwitch={isDrug} />: null }
            <Grid container spacing={4} >
              <Grid item >
                {<SelectCondition oktosavecond={allowSaveCond} {...props} passCondition={getCondition}/>} 
              </Grid>
              <Grid item lg={9}>
                { drugtreatment ?  <SearchTreatment  {...props} oktosave={allowSave} updateoptions={handleDrugTreatmentSelect} style={{position: 'relative', zIndex: 3, textAlign: 'center', marginLeft: '5px'}}/> : null}
              </Grid>
              <Grid item xs={12}>
              { drugtreatment ? <DrugTreatmentOptions {...props} getoptions={getDrugTreatmentOptions}/> : null}
              </Grid>
              <Grid item xs={12}>
              { !drugtreatment ? <OtherTreatmentOptions {...props} getoptions={getOtherTreatmentOptions} oktosave={allowSave}/> : null}
              </Grid>
            </Grid>
            <br />
            <Button disabled={!allowsave || !allowsavecond } size='medium' color='primary' variant="contained" onClick={() => {(handleAdd(options, treatment)); (handleClose())}}><SaveIcon style={{marginLeft: '-2px', marginRight: '3px'}}/>Save</Button>
            &nbsp;
            <Button size='medium' style={{color: 'grey'}} variant="outlined" onClick={() => {(handleClose())}}><CancelIcon style={{marginLeft: '-2px', marginRight: '3px'}}/>Cancel</Button>
        </DialogContent>
      </Dialog> 
    );
  }

  const DeleteTreatmentDialog = (props) => {
    const { onClose, selectedValue, ...other } = props;
  
    function handleClose() {
      onClose(selectedValue);
    }
    function handleDeleteTreatment () {
      DeleteTreatment(props)
    }
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Confirm treatment deletion</DialogTitle>
          <div style={{width:'50%', textAlign: 'center', padding: '10px'}}>
            <Chip 
            avatar={<Avatar > <TreatmentsIcon/></Avatar>}
            label={props.delete.treatment.properties.drug_name ? props.delete.treatment.properties.drug_name : props.delete.treatment.properties.other_treatment}
            />
          </div>
          <div style={{width:'50%', textAlign: 'center', padding: '10px'}}>
            <Chip 
            style={{backgroundColor: '#b77aa7', color: 'white'}}
            avatar={<Avatar style={{backgroundColor: '#a34e8c', color: 'white'}}> <ConditionIcon/></Avatar>}
            label={props.delete.condition.properties.pt_name}
            />
          </div>
        <div style={{textAlign: 'center', padding: '10px'}}>
            <Button  size='large' color='secondary' variant="outlined" onClick={() => {(handleDeleteTreatment) (handleClose())}} >Yes</Button> 
            &nbsp;
            <Button size='large' color='default' variant="outlined" onClick={handleClose}> No</Button>
        </div>
    </Dialog>
    );
  }


const StyleAddTreatmentDialog = withStyles(styles)(AddTreatmentDialog)


export { 
  StyleAddTreatmentDialog,
  DeleteTreatmentDialog }
