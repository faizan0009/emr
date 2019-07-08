import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {today} from '../../../Utils/functions';

export default function OtherTreatmentOptions(props) {
    const [state, setState] = React.useState({
        other_treatment: props.edit ? props.edit.treatment.properties.other_treatment : '',
        add_instructions: props.edit ? props.edit.treatment.properties.add_instructions : '',
        start_date: props.edit ? props.edit.treatment.properties.start_date : today,
        duration_days: props.edit ? props.edit.treatment.properties.duration_days : undefined,
    })
    return (
        <Grid container>
            {props.getoptions(state)}
            {state.other_treatment.trim() !== '' ? props.oktosave(true): props.oktosave(false)}
            <TextField 
            required
            error={state.duration_days < 0}
            margin="normal"
            id='other_treatment'
            label='Other Treatment'
            value={state.other_treatment}
            helperText={props.edit ? <Typography variant='caption' color='primary'>Changing the treatment name will create a new treatment</Typography> : false}
            variant='outlined'
            multiline
            style={{width: '30%'}}
            onChange={(e) => {(setState({...state, 'other_treatment': e.target.value }))}}
            />
            &nbsp;
            <TextField 
            required
            margin="normal"
            id='start_date'
            label='Start Date'
            value={state.start_date}
            variant='outlined'
            helperText='mm-dd-yyyy'
            type="date"
            onChange={(e) => {(setState({...state, 'start_date': e.target.value }))}}
            InputLabelProps={{
                shrink: true,
            }}
            />
            &nbsp;
            <TextField 
            error={state.duration_days < 0}
            margin="normal"
            id='duration_days'
            label='Duration (days)'
            value={state.duration_days}
            variant='outlined'
            type="number"
            onChange={(e) => {(setState({...state, 'duration_days': e.target.value }))}}
            />
            &nbsp;
            <br />
            <Grid container>
            <TextField 
            error={state.duration_days < 0}
            margin="normal"
            id='add_instructions'
            label='Instructions'
            value={state.add_instructions}
            variant='outlined'
            multiline
            rows='4'
            style={{width: '30%'}}
            onChange={(e) => {(setState({...state, 'add_instructions': e.target.value }))}}
            />
            </Grid>
        </Grid>
    )
}
