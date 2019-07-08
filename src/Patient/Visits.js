import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actionTypes';
import { Redirect } from 'react-router-dom';

import { getvisitsQuery } from './Queries';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Vist ID' },
  { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'vitals', numeric: true, disablePadding: false, label: 'Vitals Measured?' },
  { id: 'conditions', numeric: true, disablePadding: false, label: 'Conditions diagnosed?' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    alignContent: 'center'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

function VisitsTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{patientuuid: props.patient}}
    const parameters = objb
    session
    .run(getvisitsQuery, parameters)
    .then (recs => {
      if (isSubscribed) {
        const response = {recs}
        setRows(response.recs.records.map((item, i) => item._fields).map(
          ([visituuid, visitid, visitdate, conditions, vitals]) => ({visituuid, visitid, visitdate, conditions, vitals})
        ))
      }
    })
    .catch(function (error) 
    {console.log(error); 
    session.close();});
    return () => isSubscribed = false  
    }, [props.neo4j, props.patient])

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const renderRedirect = () => {
    if (redirect) {
    return (<Redirect  to='/EditVisit' />)
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    !rows ? <> no vists </> : 
    <div className={classes.root}>
          {renderRedirect()}
      <Paper className={classes.paper}>
      <Typography variant="h6" color='textSecondary' align='center'>Visits</Typography>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.visituuid}
                      onClick={() => { (props.onVisitSelect(row.visituuid)); (setRedirect(true)) }}
                      style={{cursor: 'pointer'}}
                      
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none" >
                        {row.visitid}
                      </TableCell>
                      <TableCell align="right">{row.visitdate}</TableCell>
                      <TableCell align="right">{row.vitals}</TableCell>
                      <TableCell align="right">{row.conditions}</TableCell>
                      {}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
const mapStatetoProps = state => {
    return {
      drawer: state.drawer,
      neo4j: state.dbserver,
      patient: state.patient
    }
  }

  const mapDispatchtoProps = dispatch => {
    return {
      onVisitSelect: (uuid) => dispatch ({type: actionTypes.SELECTEDVISIT, val: uuid}),
    }
  }
  export default connect (mapStatetoProps, mapDispatchtoProps)(VisitsTable)