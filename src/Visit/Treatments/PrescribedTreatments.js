import React, {useState, useEffect} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddBox';
import Loading from '../../Navigation/Loading';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import TreatmentsIcon from '@material-ui/icons/LocalHospitalSharp';
import Tooltip from '@material-ui/core/Tooltip';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';
import {connect} from 'react-redux';

import { gettreatmentsQuery } from '../Queries';
import { StyleAddTreatmentDialog, DeleteTreatmentDialog } from './Dialogues/Dialogs';


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      position: 'relative', 
      zIndex: 0
    },
  }));
  

function EditTreatments(props) {
    const [hits, setHits] = useState([])
    const [error, setError] = useState(false)
    const [opendelete, setOpendelete] = useState(false);
    const [openadd, setOpenadd] = useState(false);
    const [openedit, setOpenedit] = useState(false);
    const [deleteID, setdeleteID] = useState([])
    const [editID, seteditID] = useState([])
  
    const classes = useStyles(); 

    useEffect (() => {
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{visituuid: props.visit}}
        const parameters = objb
        session 
        .run(gettreatmentsQuery, parameters)
        .then (recs => {
          if (isSubscribed) {
            const response = {recs}
            setHits(response.recs.records.flatMap((item, i) => item._fields))
          }
          })
        .catch(function (error) 
        {console.log(error)
          setError(error); 
        session.close();});  
        return () => isSubscribed = false
    }, [props, openadd, opendelete, openedit, props.deletedcondition])

    function handledeleteclick (event, row) {
        setOpendelete(true);
        setdeleteID(row)
        }
        const handleClosedelete = value => {
          setOpendelete(false);
        };
      function handleeditclick (event, row) {
        setOpenedit(true);
        seteditID(row)
        }
        const handleCloseedit= value => {
          setOpenedit(false);
        };
        function handleaddclick (event, row) {
          setOpenadd(true);
          }
          const handleCloseadd= value => {
            setOpenadd(false);
          };

    return (
    <div style={{padding: '10px'}}> 
      <Loading open={!hits[0] && !error ? true : false} />
      <Table className={classes.table} size='small' padding='none'>
        <TableHead>
          <TableRow>
            <TableCell>Treatment</TableCell>
            <TableCell >Condition</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">Duration (days)</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {hits.map((row, i) => (
            <TableRow hover key={i}  >
              <TableCell component="th" scope="row"> 
                <Tooltip title={row.treatment.properties.drug_name ? row.treatment.properties.drug_name : row.treatment.properties.other_treatment} placement='top'>
                  <Chip 
                  size="small"
                  avatar={<Avatar> <TreatmentsIcon/></Avatar>}
                  label={row.treatment.properties.drug_name ? row.treatment.properties.drug_name.substring(0, 30): row.treatment.properties.other_treatment}
                  />
                </Tooltip>
              </TableCell>
                <TableCell component="th" scope="row"> 
                <Tooltip title={row.condition.properties.pt_name ? row.condition.properties.pt_name : ''} placement='top'>
                  <Chip 
                  size="small"
                  style={{backgroundColor: '#b77aa7', color: 'white'}}
                  avatar={<Avatar style={{backgroundColor: '#a34e8c', color: 'white'}}> <ConditionIcon/></Avatar>}
                  label={row.condition.properties.pt_name ? row.condition.properties.pt_name.substring(0, 30) : ''}
                  />
                </Tooltip>
                </TableCell>
              <TableCell align="right" component="th" scope="row"> {row.treatment.properties.start_date}</TableCell>
              <TableCell align="right" component="th" scope="row"> {row.treatment.properties.duration_days}</TableCell>
              <TableCell align="right">
                <IconButton  size='medium'  color='default' onClick={(event) => handleeditclick(event, row)}>
                  <EditIcon />
                </IconButton>
                &nbsp;
                <IconButton size='medium' color='default' onClick={(event) => handledeleteclick(event, row)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        <br/>
      <div>
        <Button size='small' color='primary' variant="outlined" onClick={handleaddclick}><AddIcon /> &nbsp; Add Treatment </Button>
        {opendelete ? <DeleteTreatmentDialog {...props} delete={deleteID} open={opendelete} onClose={handleClosedelete} /> : null}
        {openedit ? <StyleAddTreatmentDialog {...props} edit={editID} open={openedit} onClose={handleCloseedit} /> : null}
        {openadd ? <StyleAddTreatmentDialog {...props} open={openadd} onClose={handleCloseadd} /> : null}
      </div>
    </div>
    )
}

const mapStatetoProps = state => {
  return {
    deletedcondition: state.deletedcondition
  }
}
export default connect (mapStatetoProps) (EditTreatments)
