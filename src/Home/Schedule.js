import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import "./Schedule.css";
import Grid from '@material-ui/core/Grid';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const myEventsList = [
  {
      id: 1,
      title: 'Appointment',
      allDay: false,
      start: new Date(2019, 4, 28, 11, 0, 0, 0),
      end: new Date(2019, 4, 28, 12, 0, 0, 0),
    },
]

const MyCalendar = props => (
  <Grid container spacing={10}>
    <Grid item md={12}>
      <BigCalendar
        selectable
        defaultView={BigCalendar.Views.WEEK}
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
      />
    </Grid>
  </Grid>
)
export default MyCalendar