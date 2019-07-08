import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddVisitIcon from '@material-ui/icons/RoomOutlined';
import AddPatientIcon from '@material-ui/icons/PersonPinCircle';
import TreatmentsIcon from '@material-ui/icons/LocalHospitalSharp';
import ViewAgendaOutlined from '@material-ui/icons/CalendarTodayOutlined';
import AddPatient from '../Patient/EditPatientInfo'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(-5, 1, 1, 1),
    margin: theme.spacing(1, 1, 1, -1),
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: '#f2f2f2',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

function IconLabelButtons(props) {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false)

  function handleEditSave () {
    setEdit(false)
  }
  return (
    <>
    <div className={classes.root}>
      <Button onClick={() => {(setEdit(true))}} variant="outlined" className={classes.button} >
        <AddPatientIcon className={classes.leftIcon}  />
        Add Patient
      </Button>
      <Button variant="outlined" className={classes.button}>
        <AddVisitIcon className={classes.leftIcon} />
        Add Visit
      </Button>
      <Button variant="outlined" className={classes.button}>
        <TreatmentsIcon className={classes.leftIcon} />
        Add Treatment
      </Button>
      <Button variant="outlined" className={classes.button}>
        <ViewAgendaOutlined className={classes.leftIcon} />
        Add Appointment
      </Button>
    </div>
    <div>
      {edit ? <AddPatient {...props} onSave={handleEditSave}  addPatient={edit} /> : null}
    </div>
    </>
  );
}

export default IconLabelButtons;