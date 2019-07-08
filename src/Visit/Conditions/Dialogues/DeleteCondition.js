import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DeleteDiagnostic } from '../../Queries';
import Chip from '@material-ui/core/Chip';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';
import Avatar from '@material-ui/core/Avatar';
import {connect} from 'react-redux';
import * as actionTypes from '../../../store/actionTypes';

const DeleteConditionDialog = (props) => {
    const { onClose, selectedValue, ...other } = props;
  
    function handleClose() {
      onClose(selectedValue);
    }

    function handleDelete () {
        DeleteDiagnostic(props);
    }
  
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Confirm diagnostic deletion</DialogTitle>
        <div style={{width:'50%', textAlign: 'center', padding: '10px'}}>
        <Chip 
            style={{backgroundColor: '#b77aa7', color: 'white'}}
            avatar={<Avatar style={{backgroundColor: '#a34e8c', color: 'white'}}> <ConditionIcon/></Avatar>}
            label={props.delete.condition.properties.pt_name}
            />
        </div>
        <div style={{textAlign: 'center', padding: '10px'}}>
            <Button  size='large' color='secondary' variant="outlined" onClick={() => {(handleDelete) (handleClose()) ; props.onConditionDelete(props.delete.condition.identity)}} >Yes</Button> 
            &nbsp;
            <Button size='large' color='default' variant="outlined" onClick={handleClose}> No</Button>
        </div>
    </Dialog>
    );
  }

  const mapDispatchtoProps = dispatch => {
    return {
      onConditionDelete: (id) => dispatch ({type: actionTypes.DELETEDCONDITION, val: id}),
    }
  }

  export default connect (undefined, mapDispatchtoProps) (DeleteConditionDialog)