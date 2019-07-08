import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Redirect, withRouter } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import * as actionTypes from '../store/actionTypes';
import Typography from '@material-ui/core/Typography';

import { searchQuery } from './Queries';

const styles = (theme: Theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.35),
      },
      marginRight: theme.spacing.unit * 1,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit * 12,
        width: 'auto',
      },
    },
    box: {
      position: 'relative',
      padding: theme.spacing(0.6, 0, 0, 0.5),
      backgroundColor: 'inherit',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit * 1,
        width: 'auto', '&:focus': {
          width: 500,
        },
      },
      color: 'white',
      border: 'none',
      fontFamily: 'Roboto',
      fontWeight: 300,
      fontSize: 18,
    },
    suggestionsContainerOpen: {
      display: 'block',
      position: 'absolute',
      top: 51,
      width: '120%',
      border: 'none',
      backgroundColor: 'white',
      fontFamily: 'Roboto',
      fontWeight: 300,
      fontSize: 14,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
      zIndex: 2,
      left: 0,
      right: 0,
    },
    insidebox:{
      outline: 'none',
    },
    inputRoot: {
        color: 'white',
        width: '80%',
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 5,
      transition: theme.transitions.create('width'),
      width: '80%',
      [theme.breakpoints.up('md')]: {
        width: 'auto', '&:focus': {
          width: '150%',
        },
      },
      color: 'white',
    },
    suggestion: {
      cursor: 'pointer',
      padding: '1px 1px',
    },
    suggestionsList: {
      margin: 1,
      padding: 0,
      listStyleType: 'none',
      color: theme.palette.text.secondary,
      textAlign: 'left',
      fontFamily: 'Roboto',
      fontSize: 13,
    },
    suggestionHighlighted: {
      backgroundColor: '#eaeaea',
      borderLeft: '2px solid',
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
    },
    container: {
      position: 'relative',
      color: 'white',
    },
    chip: {
      margin: theme.spacing.unit,
      width: '60%',
      height: '40%',
      fontFamily: 'Roboto',
      fontSize: 9
    },
  });
  function  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: '',
          isLoading: true,
          loading: false,
          hits: [],
          suggestions: [],
          popper: '',
          redirect: false,
          selected: []
        };
      }
      componentDidUpdate (prevProps, prevState) {
        if (this.state.value !== prevState.value && this.state.value !== '' && this.state.value !== undefined) {
          const neo4j_driver = this.props.neo4j
          const session = neo4j_driver.session()
          let objb = {search:{globalsearch: this.state.value}}
          let parameters = objb
          session
          .run(searchQuery, parameters)
          .then (records => {
            this.setState({
                isLoading: false,
                hits: records
              })
            })
          .catch(function (error) {
              console.log(error);
            session.close();
            });
            const { hits, isLoading } = this.state
            if (isLoading === false) {
          const data = hits.records
          let fields = data.map((item, i) => item._fields)
          let dataset = fields.map((
          [node]) => (
          {node}));
          this.setState({
            suggestions: dataset,
          })
        }}
      }
      search = async val => {
        this.setState({ loading: true });
        const results = this.hits;
        const searchresults = results;

        this.setState({ searchresults, loading: false });
      };
      onChangeHandler = async e => {
        this.search(e.target.value);
        this.setState({ value: e.target.value });
      };
      getSuggestions(value) {
        const escapedValue = escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
          return [];
        }

        return this.state.suggestions
      }
      onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: this.getSuggestions(value)
        });
      };
      onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };
      onPatientSuggestionSelected = (event, {newValue}) => {
        this.setState({
            value: '',
            redirect: true})
      };

      renderRedirect = () => {
        if (this.state.redirect && this.state.selected === 'patient') {
        return (<><Redirect  to='/Patients' /> {this.setState({redirect:false})}</>)
        }
        if (this.state.redirect && this.state.selected === 'condition') {
          return (<><Redirect  to='/Conditions' /> {this.setState({redirect:false})}</>)
          }
      }
      renderSuggestion = suggestion => (
           <Grid container>
           {(() => {
             if (suggestion.labels[0] === 'condition')  {
              return (
            <>
            <Grid item>
              <Chip style={{backgroundColor: '#b77aa7', color: 'white'}} label={suggestion.labels} className={this.props.classes.chip} />
            </Grid>
            <Grid item style={{padding: '10px'}}>
              {suggestion.properties.pt_name}
            </Grid>
            </>
            )
             }
             if (suggestion.labels[0] === 'patient') {
               return (
                <>
                <Grid item>
                <Chip color="primary" label={suggestion.labels} className={this.props.classes.chip} />
                </Grid>
                <Grid item xs={3} style={{padding: '10px'}}>
                <Typography variant='caption'>Name:</Typography> {suggestion.properties.first_name + " " + suggestion.properties.last_name}
                </Grid> 
              <Grid item xs={3} style={{padding: '10px'}}>
              <Typography variant='caption'>NSSF#:</Typography> {suggestion.properties.nssf_number}
                </Grid> 
                <Grid item xs={3} style={{padding: '10px'}}>
                <Typography variant='caption'>DoB:</Typography>{suggestion.properties.dob}
                </Grid> 
                </>
              )
             }
           })()}
           </Grid>
      )
    render () {
        const { classes } = this.props;
        const { value } = this.state;
        return (
            <>
            {this.renderRedirect()} 
            <Autosuggest
            suggestions={this.state.suggestions.map((item, i) => item.node)}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onPatientSuggestionSelected}
            getSuggestionValue={ (e) =>  {
              this.setState({selected: e.labels[0]})
                if (e.labels[0] === 'condition') return (this.props.onConditionSelect(e.properties.meddra_code))
                if (e.labels[0] === 'patient') return (this.props.onPatientSelect(e.properties.uuid))
              }
            }
            renderSuggestion={this.renderSuggestion}
            theme={{
              container: classes.inputInput,
              input: classes.box,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion,
              inputFocused: classes.insidebox,
              suggestionHighlighted: classes.suggestionHighlighted
            }}
            inputProps = {{
              value,
              onChange: e => this.onChangeHandler(e),
            }}
            renderSuggestionsContainer={options => (
                <Paper {...options.containerProps} color='Primary'>
                    {options.children}
                </Paper>
            )}
             />
            </>
        )
    }
}
const mapStatetoProps = (state) => {
    return {
      neo4j: state.dbserver,
    }
  }
const mapDispatchtoProps = dispatch => {
    return {
      onPatientSelect: (uuid) => dispatch ({type: actionTypes.SELECTEDPATIENT, val: uuid}),
      onConditionSelect: (meddra) => dispatch ({type: actionTypes.SELECTEDCONDITION, val: meddra}),
    }
  }
export default connect (mapStatetoProps, mapDispatchtoProps) (withRouter (withStyles(styles)(Search)))
