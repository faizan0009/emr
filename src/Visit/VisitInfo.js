import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import { getvisitinfoQuery, EditDateQuery } from './Queries';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Loading from '../Navigation/Loading';


const VisitInfo = (props) => {
    const [hits, setHits] = useState([])
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState(false)


    useEffect(() => {
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{visituuid: props.visit}}
        const parameters = objb
        session 
        .run(getvisitinfoQuery, parameters)
        .then (recs => {
          if (isSubscribed) {
            const response = {recs}
            setHits(response.recs.records.flatMap((item, i) => item._fields).map((item, i) => item.properties)[0])  
        }
            })
        .catch(function (error) 
        {console.log(error);  setError(error);
        session.close();});
        return () => isSubscribed = false  
        // eslint-disable-next-line
        }, [])

    const handleChange = (event) => {
        setHits({
            date: event.target.value, 
        }) 
      };
    return (
    <>
    <Loading open={!hits[0] && !error ? true : false} />
    <TextField 
    id="id"
    label="ID"
    value={hits.id}
    margin="normal"
    variant="outlined"
    InputProps={{
        readOnly: true,
    }}
    /> &nbsp;
    <TextField
        id="visit-date"
        label="Visit Date"
        margin="normal"
        type='date'
        variant="outlined"
        helperText="mm-dd-yyyy"
        value={hits.date}
        required
        InputProps={ !props.edit? {
        readOnly: true,
        } :{ 
        readOnly: false,
    }}
        // InputLabelProps={{
        // shrink: true,
        // }}
        onChange={handleChange}
    />
    {!saved && props.edit ? 
    <div style={{padding: '10px'}}>
    <Button size='small' color='primary' variant='contained' onClick={() => {(EditDateQuery(props, hits)); (setSaved(false)); (props.update(false))}}><SaveIcon /> Save</Button>
    &nbsp;
    <Button size='small' style={{color: 'grey'}} color='inherit' variant="outlined" onClick={() => (props.update(false))}><CancelIcon /> Cancel</Button>  
    </div>: null}
    </ >
    )
}

export default VisitInfo