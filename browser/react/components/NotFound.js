import React, { Component } from 'react';
import { Link } from 'react-router';
import AppContainer from '../containers/AppContainer'

const NotFound = props => 
   (
      <div>
        <h3>404 Page not found</h3>
        <p>This is why we can't have nice things</p>
        <Link to='/communique'>Take me back where I belong!</Link>
      </div>
  );

export default NotFound;