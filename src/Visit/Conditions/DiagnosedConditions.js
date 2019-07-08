import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
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
import StyleAddDialog  from './Dialogues/AddCondition';
import StyleEditDialog from './Dialogues/EditCondition';
import Loading from '../../Navigation/Loading';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import ConditionIcon from '@material-ui/icons/BugReportOutlined';
import DeleteConditionDialog from './Dialogues/DeleteCondition';

import { editconditionQuery } from '../Queries';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    flexGrow: 1,
    width: '100%',
  },
}));

function EditConditions(props) {
  const [hits, setHits] = useState([])
  const [error, setError] = useState(false)
  const [opendelete, setOpendelete] = useState(false);
  const [openadd, setOpenadd] = useState(false);
  const [openedit, setOpenedit] = useState(false);
  const [deleteID, setdeleteID] = useState([])
  const [editID, seteditID] = useState([])
  const classes = useStyles();

  useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{visituuid: props.visit}}
    const parameters = objb
    session 
    .run(editconditionQuery, parameters)
    .then (recs => {
      if (isSubscribed) {
        const response = {recs}
        setHits(response.recs.records.flatMap((item, i) => item._fields))
      }
      })
    .catch(function (error) 
    {console.log(error); setError(error); 
    session.close();});  
    return () => isSubscribed = false
    }, [props, openedit, opendelete, openadd])

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
    <>
    <Loading open={!hits[0] && !error ? true : false} />
    <Table className={classes.table} size='small' padding='none'>
      <TableHead>
        <TableRow>
          <TableCell>Condition</TableCell>
          <TableCell align="right">Status</TableCell>
          <TableCell align="right">Certainty</TableCell>
          <TableCell align="right">Description</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {hits.map((row, i) => (
          <TableRow hover key={i}>
            <TableCell component="th" scope="row"> 
              <Tooltip title={row.condition.properties.pt_name} placement='top'>
                <Chip 
                size="small"
                style={{backgroundColor: '#b77aa7', color: 'white'}}
                avatar={<Avatar style={{backgroundColor: '#a34e8c', color: 'white'}}> <ConditionIcon/></Avatar>}
                label={row.condition.properties.pt_name}
                />
              </Tooltip>
            </TableCell>
            <TableCell align="right">{row.diagnose.properties.status}</TableCell>
            <TableCell align="right">{row.diagnose.properties.certainty}</TableCell>
            <TableCell align="right">{row.diagnose.properties.description}</TableCell>
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
      <Button size='small' color='primary' variant="outlined" onClick={handleaddclick}><AddIcon /> &nbsp; Add Condition </Button>
      {opendelete ? <DeleteConditionDialog {...props} delete={deleteID} open={opendelete} onClose={handleClosedelete} /> : null}
      {openedit ? <StyleEditDialog {...props} edit={editID} open={openedit} onClose={handleCloseedit} /> : null}
      {openadd ? <StyleAddDialog {...props} open={openadd} onClose={handleCloseadd} /> : null}
      </div>
    </>
  );
}
const mapStatetoProps = state => {
  return {
    neo4j: state.dbserver,
    visit: state.visit
  }
}
export default connect (mapStatetoProps) (EditConditions)
