import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/PersonOutlineRounded';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    padding: '10px'
  },
}));

function LastPatients() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <Avatar>
            <PersonIcon />
        </Avatar>
          <Typography className={classes.heading}>Patient 1</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>Patient number 1</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel >
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
            <Avatar>
                <PersonIcon />
            </Avatar>
          <Typography className={classes.heading}>Patient 2</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Patient number 2
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
export default LastPatients;

