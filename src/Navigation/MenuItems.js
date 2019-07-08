import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Link, withRouter } from 'react-router-dom'

import HomeIcon from '@material-ui/icons/Home';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonCircleIcon from '@material-ui/icons/PersonPinCircle';
import ViewAgendaOutlined from '@material-ui/icons/CalendarTodayOutlined';
import TreatmentsIcon from '@material-ui/icons/LocalHospitalSharp';
import VisitIcon from '@material-ui/icons/RoomOutlined';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';

const  MenuItems = (props) => {
    return (
        <>
        <List>

        <ListItem button component={Link} to="/Patients" selected= {'/Patients' === props.pathname}>
            <ListItemIcon><PersonCircleIcon /></ListItemIcon>
            <ListItemText primary='My Last Patient' />
          </ListItem>

          <br /> <Divider /> <br />

          <ListItem button component={Link} to="/" selected= {'/' === props.pathname}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary='My Home' />
          </ListItem>

          <ListItem button component={Link} to="/Dashboard" selected= {'/Dashboard' === props.pathname}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>

          <br /> <Divider /> <br />

          <ListItem button>
            <ListItemIcon><VisitIcon /></ListItemIcon>
            <ListItemText primary='Visits' />
          </ListItem>

          <ListItem button>
            <ListItemIcon><TreatmentsIcon /></ListItemIcon>
            <ListItemText primary='Treatments' />
          </ListItem>

          <ListItem button>
            <ListItemIcon><ViewAgendaOutlined /></ListItemIcon>
            <ListItemText primary='Schedules' />
          </ListItem>

          <ListItem button component={Link} to="/Conditions" selected= {'/Conditions' === props.pathname}>
            <ListItemIcon><ConditionIcon /></ListItemIcon>
            <ListItemText primary='Conditions' />
          </ListItem>

        </List>
        </>
    )
}

export default withRouter (MenuItems)
