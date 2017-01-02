import React, { Component } from 'react';
import { Link } from 'react-router';
import AppContainer from '../containers/AppContainer'

export default class NotFound extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <h3>404 Page not found</h3>
        <p>This is why we can't have nice things</p>
        <Link to='/Kigo'>Take me back where I belong!</Link>
      </div>
    );
  }
}