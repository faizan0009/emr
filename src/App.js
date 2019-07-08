import React from 'react';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

import Routes from './Routes/Routes'

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

const App = (props) => {
  return (
      <MuiThemeProvider theme={theme}>
          <Routes {...props}/>
      </MuiThemeProvider>
  );
}
export default App;
