// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
// import { createStore, applyMiddleware, compose } from 'redux'
// import reducer from './store/reducer'
// import { Provider } from 'react-redux'
// import thunk from 'redux-thunk'


// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// const store = createStore(reducer, composeEnhancers (applyMiddleware(thunk)));

// ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.register();

//new config

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
// import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './store/reducer'
// import { BrowserRouter } from 'react-router-dom';
// import registerServiceWorker from './registerServiceWorker';
import * as serviceWorker from './serviceWorker';

const store = createStore(reducer);

serviceWorker.register();

const render = Component => {
  return ReactDOM.render(
    <Provider store={store}>
        <Component />
    </Provider>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}