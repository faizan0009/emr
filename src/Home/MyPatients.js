import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LastPatients from './LastPatients';

function MyPatients() {
    return (
        <Grid container spacing={10}>
        <Grid item md={6} >
            <Paper style={{padding: '10px'}}> 
                <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Last Patient Visits</Typography>
                <LastPatients />
            </Paper>
        </Grid>
        <Grid item md={6} >
            <Paper style={{padding: '10px'}}> 
                <Typography variant="h6" paragraph color='textSecondary' align= 'center'>Frequent Patients</Typography>
            </Paper>
        </Grid>
        </Grid>
    )
}
export default MyPatients
