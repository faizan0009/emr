import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import { searchConditions } from '../../Queries';

export default function SelectCondition(props) {
    const [hits, setHits] = React.useState([])
    const [selected, setSelected] = React.useState({
        meddra_code: props.edit ? props.edit.condition.properties.meddra_code : ''
    })

    React.useEffect (() => {
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{visituuid: props.visit}}
        const parameters = objb
        session 
        .run(searchConditions, parameters)
        .then (recs => {
          if (isSubscribed) {
            const response = {recs}
            setHits(response.recs.records.flatMap((item, i) => item._fields).map(item => item.properties))
          }
          if (props.edit) props.oktosavecond(true) 
          })
        .catch(function (error) 
        {console.log(error); 
        session.close();});  
        return () => isSubscribed = false
    }, [props, props.neo4j, props.visit])

    const handleChange = (name) => event => {
        setSelected({ ...selected, 
            [name]: event.target.value
        });
        
        props.oktosavecond(true)    
      };

    return (
        <> 
        {props.passCondition(selected.meddra_code)}
            <TextField 
            id='select-condition'
            label='Condition'
            value={selected.meddra_code}
            variant='outlined'
            select
            required
            helperText={props.edit ? <Typography variant='caption' color='primary'>Changing the Condition will create a new treatment</Typography> : 'Select a Condition'}
            onChange={handleChange('meddra_code')}
            > 
            {hits.map((item, i) => 
                <MenuItem key={i} value={item.meddra_code} > 
                    {item.pt_name}
                </MenuItem>)}
            </TextField>
        </>
    )
}