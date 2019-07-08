import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

export function DrugSwitch(props) {
  const [state, setState] = React.useState(
    {
    checkedA: true,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
    props.controlDrugSwitch(event.target.checked)
  };

  return (
    <div style={{padding: (1, 1, 1, 20)}}> 
    <FormGroup row>
      <FormControlLabel
        control={
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Other</Grid>
            <Grid item>
            <Switch
              checked={state.checkedA}
              onChange={handleChange('checkedA')}
              value="checkedA"
              color="primary"
            />
            </Grid>
            <Grid item>Drug</Grid>
          </Grid>
        }
      />
    </FormGroup>
    </div>
  );
}

