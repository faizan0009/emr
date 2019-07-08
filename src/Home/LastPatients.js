import React, {useState, useEffect} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import * as actionTypes from '../store/actionTypes';
import { Redirect, withRouter } from 'react-router-dom';

import {lastPatientsQuery} from './Queries';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      width: '100%',
    },
  }));

const LastPatients = (props) => {
const [hits, setHits] = useState([])
const [redirect, setRedirect] = useState(false)
const classes = useStyles();

    useEffect(() => {
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{visituuid: props.visit}}
        const parameters = objb
        session 
        .run(lastPatientsQuery, parameters)
        .then (recs => {
          if (isSubscribed) {
            const response = {recs}
            setHits(response.recs.records.flatMap((item, i) => item._fields))
          }
          })
        .catch(function (error) 
        {console.log(error); 
        session.close();});  
        return () => isSubscribed = false
        }, [props])

        const renderRedirect = () => {
            if (redirect) {
            return (<Redirect  to='/Patients' />)
            }
          }

    return (
        <>
        {renderRedirect()}
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell align="right">Last Visit</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {hits.map((row, i) => (
                    <TableRow hover style={{cursor: 'pointer'}} key={i} onClick={() => {(props.onPatientSelect(row.patient.properties.uuid)); (setRedirect(true))}}>
                        <TableCell component="th" scope="row"> {row.patient.properties.first_name} {row.patient.properties.last_name} </TableCell>
                        <TableCell align="right">{row.visit.properties.date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </>
    )
}

const mapStatetoProps = state => {
    return {
      neo4j: state.dbserver,
    }
}

const mapDispatchtoProps = dispatch => {
    return {
        onPatientSelect: (uuid) => dispatch ({type: actionTypes.SELECTEDPATIENT, val: uuid}),
    }
}
export default connect (mapStatetoProps, mapDispatchtoProps ) (withRouter (LastPatients))
