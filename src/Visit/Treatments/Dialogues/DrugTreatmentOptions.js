import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import {today} from '../../../Utils/functions';

const doseage_form = [
    {
    value: 'mg',
    label: 'mg'
    },
    {
    value: 'ml',
    label: 'ml'
    },
    {
    value: 'mg/ml',
    label: 'mg/ml'
    },
]

const as_needed = [
    {
    value: 'yes',
    label: 'yes'
    },
    {
    value: 'no',
    label: 'no'
    },
]


export default function DrugTreatmentOptions(props) {
    const [state, setState] = React.useState({
        quantity_units: props.edit ? props.edit.treatment.properties.quantity_units : undefined,
        doseage_quantity: props.edit ? props.edit.treatment.properties.doseage_quantity : undefined,
        doseage_form: props.edit ? props.edit.treatment.properties.doseage_form : 'mg',
        frequency_interval_hours: props.edit ? props.edit.treatment.properties.frequency_interval_hours : undefined,
        start_date: props.edit ? props.edit.treatment.properties.start_date : today,
        duration_days: props.edit ? props.edit.treatment.properties.duration_days : undefined,
        as_needed: props.edit ? props.edit.treatment.properties.as_needed :  false,
        instructions: props.edit ? props.edit.treatment.properties.instructions : '',
    })
    return (
        <Grid container>
            {props.getoptions(state)}
            <TextField 
            error={state.quantity_units < 0}
            margin="normal"
            id='quantity_units'
            label='Quantity Units'
            value={state.quantity_units}
            variant='outlined'
            type="number"
            onChange={(e) => {(setState({...state, 'quantity_units': e.target.value}))}}
            /> 
            &nbsp;
            <TextField 
            error={state.doseage_quantity < 0}
            margin="normal"
            id='doseage_quantity'
            label='Doseage Quantity'
            value={state.doseage_quantity}
            variant='outlined'
            type="number"
            onChange={(e) => {(setState({...state, 'doseage_quantity': e.target.value }))}}
            />
            &nbsp;
            <TextField 
            error={state.doseage_form === ''}
            margin="normal"
            id='doseage_form'
            label='Doseage Form'
            value={state.doseage_form}
            variant='outlined'
            select
            style={{width: '10%'}}
            onChange={(e) => {(setState({...state, 'doseage_form': e.target.value }))}}
            InputLabelProps={{
                shrink: true,
            }}
            >
                {doseage_form.map((item, i) => 
                    <MenuItem key={i} value={item.value}> {item.label}</MenuItem>
                    )}
            </TextField>
            &nbsp;
            <TextField 
            error={state.frequency_interval_hours < 0}
            margin="normal"
            id='frequency_interval_hours'
            label='Frequency Interval (hours)'
            value={state.frequency_interval_hours}
            variant='outlined'
            type="number"
            onChange={(e) => {(setState({...state, 'frequency_interval_hours': e.target.value }))}}
            />
            &nbsp;
            <TextField 
            margin="normal"
            id='start_date'
            label='Start Date'
            value={state.start_date}
            variant='outlined'
            type="date"
            helperText='mm-dd-yyyy'
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
            <TextField 
            margin="normal"
            id='as_needed'
            label='As needed'
            value={state.as_needed}
            variant='outlined'
            select
            style={{width: '10%'}}
            onChange={(e) => {(setState({...state, 'as_needed': e.target.value }))}}
            InputLabelProps={{
                shrink: true,
            }}
            >
                {as_needed.map((item, i) => 
                    <MenuItem key={i} value={item.value}> {item.label}</MenuItem>
                    )}
            </TextField>
            &nbsp;
            <TextField 
            fullWidth
            margin="normal"
            id='instructions'
            label='Instructions'
            value={state.instructions}
            variant='outlined'
            multiline
            rows="4"
            style={{width: '30%'}}
            onChange={(e) => {(setState({...state, 'instructions': e.target.value }))}}
            />
        </Grid>
    )
}
