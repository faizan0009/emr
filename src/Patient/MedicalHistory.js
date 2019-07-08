import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Treatments from './Treatments'; 

import { getmedicalhistoryQuery } from './Queries';

const styles = (theme) => ({
    root: {
      marginLeft: theme.spacing.unit * 1
    },
  });

const  MedicalHistory = (props) => {
    const [hits, setHits] = useState([])
    useEffect(() => {
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{patientuuid: props.patient}}
        const parameters = objb
        session
        .run(getmedicalhistoryQuery, parameters)
        .then (recs => {
          if (isSubscribed) {
            const response = {recs}
            setHits(response.recs.records.map((item, i) => item._fields).map(
              ([condition]) => ({condition})
            ).map((item, i) => item.condition.properties))
          }
        })
        .catch(function (error) 
        {console.log(error); 
        session.close();});  
        return () => isSubscribed = false
        }, [props])
    return (
        <>
            <Grid container spacing={4} alignItems="center" justify="center">
                <Grid item md={12} >
                    {hits.map((item, i) => 
                        <div style={{padding: 5}} key={i}>
                        <Tooltip title={item.pt_name} placement="top">
                          <Chip 
                          style={{backgroundColor: '#b77aa7', color: 'white'}}
                          avatar={<Avatar style={{backgroundColor: '#a34e8c', color: 'white'}}> <ConditionIcon/></Avatar>}
                          label={item.pt_name.substring(0, 15)}
                          />
                        </Tooltip>
                         </div>
                    )}
                </Grid>
                <Grid item md={12}>
                    <div style={{padding: 5}}><Treatments /></div>
                </Grid>
            </Grid>
        </>
    )
}
const mapStatetoProps = state => {
    return {
      neo4j: state.dbserver,
      patient: state.patient
    }
  }
export default connect (mapStatetoProps)(withStyles(styles) (MedicalHistory))
