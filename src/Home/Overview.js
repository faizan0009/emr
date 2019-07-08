import React from 'react';
import Tabs from './Tabs';
import HomeButtons from './HomeButtons';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import clsx from 'clsx';
import TopAppBar from '../Navigation/TopAppBar';

const styles = (theme) => ({
    content: {
      flexGrow: 1,
      padding: theme.spacing( 5, 5, 5, 32),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -230,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  });

function Overview(props) {
    const { classes } = props;
    return (
        <>
        <TopAppBar/>
        <div className={clsx(classes.content, {
            [classes.contentShift]: props.drawer,
          })}>
            <HomeButtons />
            <Tabs />
        </div>
        </>
    )
}
const mapStatetoProps = state => {
    return {
      drawer: state.drawer,
      width: state.width
    }
  }
export default connect (mapStatetoProps) (withStyles(styles)(Overview))

// Patient file with quick access / overview of conditions, allergies and medications (Chips on patient file)