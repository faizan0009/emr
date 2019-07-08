import React from 'react';
import { getVitalsQuery } from './Queries';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Loading from '../../Navigation/Loading';

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

function Vitals(props) {
    const [hits, setHits] = React.useState([])

    const [err, setErr] = React.useState([])
    const classes = useStyles();

    React.useEffect(() => {
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{visituuid: props.visit}}
        const parameters = objb
        session 
        .run(getVitalsQuery, parameters)
        .then (recs => {
          if (isSubscribed) {
            const response = {recs}
            setHits(response.recs.records[0]._fields[0])
          }
          })
        .catch(function (error) 
        {console.log(error); setErr(error); 
        session.close();});  
        return () => isSubscribed = false
        }, [props])

    return (
        <>
        <Loading open={!hits[0] && !err ? true : false} />
        <Table className={classes.table} size='small' >
            <TableHead>
                <TableRow>
                    <TableCell>Vital</TableCell>
                    <TableCell align="right">Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {hits.map((item, i) => (
                <TableRow hover key={i}> 
                    <TableCell component="th" scope="row">{item[0].split('_').join(' ').substring(2)}</TableCell>
                    <TableCell align='right' component="th" scope="row">{item[1]}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
       </>
    )
}

export default Vitals
