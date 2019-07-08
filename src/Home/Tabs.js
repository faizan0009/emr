import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ViewAgendaOutlined from '@material-ui/icons/CalendarTodayOutlined';
import Typography from '@material-ui/core/Typography';
import VisitIcon from '@material-ui/icons/RoomOutlined';
import TreatmentsIcon from '@material-ui/icons/LocalHospitalSharp';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';

import MyPatients from './MyPatients';
import Schedule from './Schedule';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
const HomeTabs = (props) => {
  const [value, setValue] = useState(0) 
  function handleChange(event, newValue) {
    setValue(newValue);
  }
  useEffect(() => {
    let isSubscribed = true
    if (isSubscribed) {

    }
  return () => isSubscribed = false  
  }, [value])
  return (
    <>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Patients" icon={<PersonPinIcon />} />
            <Tab label="Visits" icon={<VisitIcon />} />
            <Tab label="Treatments" icon={<TreatmentsIcon />} />
            <Tab label="Schedule" icon={<ViewAgendaOutlined />} />
            <Tab label="Conditions" icon={<ConditionIcon />} />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><MyPatients /> </TabContainer>}
        {value === 1 && <TabContainer>My Visits</TabContainer>}
        {value === 2 && <TabContainer>My Treatments</TabContainer>}
        {value === 3 && <TabContainer><Schedule {...props}/></TabContainer>}
        {value === 4 && <TabContainer>My Patients Conditions</TabContainer>}
      </>
  );
}
export default HomeTabs

