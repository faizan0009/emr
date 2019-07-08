import React from 'react';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { searchconditionQuery } from '../../Queries';

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      variant='outlined'
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value, stateSuggestions) {
    if (stateSuggestions)
    return (stateSuggestions.length() === 0
      ? [] 
      : stateSuggestions)
    return ([])
  }

const useStyles = makeStyles(theme => ({
  root: {
    height: '250',
    flexGrow: 1,
    width: '80%',
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 51,
    width: '100%',
    backgroundColor: 'white',
    fontWeight: 300,
    fontSize: 14,
    zIndex: 2,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
}));

export default function SearchCondition(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    single: '',
  });
  const [stateSuggestions, setSuggestions] = React.useState([]);
  const [suggestionselected, setSuggestionSelected] = React.useState(false)

  React.useEffect(() => {
    let isSubscribed = true
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{
        condition: state.single, 
    }}
    const parameters = objb
    session 
    .run(searchconditionQuery, parameters)
    .then (recs => {
      if (isSubscribed) {
        const response = {recs}
        setSuggestions(response.recs.records.flatMap((item, i) => item._fields))
      }
    })
    .catch(function (error)
    {console.log(error); 
    session.close();})
    return () => isSubscribed = false  
  }, [props, state.single])
  
  const handleSuggestionsFetchRequested = ({ value, stateSuggestions }) => {
    setSuggestions(getSuggestions(value, stateSuggestions));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
    setSuggestionSelected(false)
  };

  const handleChange = name => (event, { newValue }) => {
    setState({
      ...state,
      [name]: newValue,
    });
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    renderSuggestion
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: 'react-autosuggest-simple',
          label: 'Condition',
          placeholder: 'Search for a condition',
          value: state.single,
          onChange: handleChange('single'),
        }}
        onSuggestionSelected={(e, value) => {(setSuggestionSelected(!suggestionselected)); (props.updateoptions(value.suggestion))}}
        focusInputOnSuggestionClick={false}
        getSuggestionValue={(e) => (e? e.label : '')}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} color='Primary'>
            {options.children}
          </Paper>
        )}
      />
    </div>
  );
}