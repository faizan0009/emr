import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { EditDiagnostic } from '../../Queries';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  menu: {
    width: 500,
  },
})

  const EditConditionDialog = (props) => {
    const { classes } = props;
    const {onClose, selectedValue, ...other } = props;
    const [options, setOptions] = React.useState(props.edit.diagnose.properties)

    const status = [
      {
        value: 'active',
        label: 'active',
      },
      {
        value: 'inactive',
        label: 'inactive',
      },
    ]
    const certainty = [
      {
        value: 'presumed',
        label: 'presumed',
      },
      {
        value: 'confirmed',
        label: 'confirmed',
      },
    ]
    function handleClose() {
      onClose(selectedValue);
    }

    function handleEdit (options) {
        EditDiagnostic(props, options)
    }

    const handleChange = (name) => event => {
      setOptions({...options,
          [name]: event.target.value, 
      });    
    };
  
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Edit Condition values</DialogTitle>
          <div style={{width:'50%', textAlign: 'center', padding: '10px'}}>
            <Chip 
            style={{backgroundColor: '#b77aa7', color: 'white'}}
            avatar={<Avatar style={{backgroundColor: '#a34e8c', color: 'white'}}> <ConditionIcon/></Avatar>}
            label={props.edit.condition.properties.pt_name}
            />
          </div>
        <div style={{textAlign: 'center', padding: '10px'}}>
              <TextField
              id="outlined-select-status"
              select
              label="Status"
              value={options.status}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText='Select Status'
              onChange={handleChange('status')}
              margin="normal"
              variant="outlined"
            >
              {status.map(option => (
                <MenuItem key={option.value} value={option.value} >
                  <div style={options.status === 'inactive' ? {fontWeight: 700}: undefined}> {option.label === 'inactive' ? option.label: undefined} </div>
                  <div style={options.status === 'active' ? {fontWeight: 400}: undefined}> {option.label === 'active' ? option.label: undefined} </div>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-select-certainty"
              select
              label="Certainty"
              value={options.certainty}
              className={classes.textField}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText='Select Certainty'
              onChange={handleChange('certainty')}
              margin="normal"
              variant="outlined"
            >
              {certainty.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-description"
              label="Description"
              multiline
              value={options.description}
              className={classes.textField}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              onChange={handleChange('description')}
              margin="normal"
              variant="outlined"
            >
              {certainty.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
                <br /> <br/>
          <Button size='large' color='primary' variant="contained" onClick={() => {(handleEdit(options)); (handleClose())}}><SaveIcon style={{marginLeft: '-2px', marginRight: '3px'}}/>Save</Button>
          &nbsp;
          <Button size='medium' style={{color: 'grey'}} variant="outlined" onClick={() => {(handleClose())}}><CancelIcon style={{marginLeft: '-2px', marginRight: '3px'}}/>Cancel</Button>

        </div>
    </Dialog>
    );
  }

  export default withStyles (styles)(EditConditionDialog)