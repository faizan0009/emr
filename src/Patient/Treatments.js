import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import TreatmentsIcon from '@material-ui/icons/LocalHospitalSharp';
import Tooltip from '@material-ui/core/Tooltip';

import { gettreatmentsQuery } from './Queries';

const styles = (theme) => ({
    root: {
      spacing: theme.spacing.unit * 2
    },
  });

const  Treatments = (props) => {
    const [hits, setHits] = useState([])
    useEffect(() => {
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{patientuuid: props.patient}}
        const parameters = objb
        session
        .run(gettreatmentsQuery, parameters)
        .then (recs => {
          if (isSubscribed) {
            const response = {recs}
            setHits(response.recs.records.map((item, i) => item._fields).map(
              ([treatment]) => ({treatment})
            ).map((item, i) => item.treatment.properties))
          }
        })
        .catch(function (error) 
        {console.log(error); 
        session.close();});
        return () => isSubscribed = false  
        }, [props.neo4j, props.patient])
    return (
        <>
            {hits.map((item, i) =>
              <div style={{padding: 5}} key={i}>
                <Tooltip title={item.drug_name ? item.drug_name : item.other_treatment} placement="top">
                  <Chip 
                  avatar={<Avatar> <TreatmentsIcon/></Avatar>}
                  label={item.drug_name ? item.drug_name.substring(0, 15) : item.other_treatment.substring(0, 15)}
                  key={item.uuid}
                  />
                </Tooltip>
              </div>
            )}
        </>
    )
}
const mapStatetoProps = state => {
    return {
      neo4j: state.dbserver,
      patient: state.patient
    }
  }
export default connect (mapStatetoProps)(withStyles(styles) (Treatments))
