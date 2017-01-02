import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer';
import Communique from './components/Communique';
import SingleCommunique from './components/SingleCommunique';
import NotFound from './components/NotFound';
import {Router, Route, hashHistory, IndexRedirect} from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={AppContainer}>
    <IndexRedirect to='communique' />
      <Route path='communique' component={Communique} />
      <Route path='communique/:communiqueId' component={SingleCommunique} /> 
      <Route path='*' status={404} component={NotFound} />
    </Route>
  </Router>,
  document.getElementById('app')
);
