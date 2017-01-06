import React, { Component } from 'react';
import axios from 'axios';
import { hashHistory } from 'react-router';

import initialState from '../initialState';
import MyNavbar from '../components/Navbar';
import Communique from '../components/Communique';
import NotFound from '../components/NotFound';

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = initialState;

    this.selectCommunique = this.selectCommunique.bind(this);
    // this.selectByDate = this.selectByDate.bind(this);
    this.filterLanguage = this.filterLanguage.bind(this);
    this.searchByContent = this.searchByContent.bind(this);
    this.searchByTitle = this.searchByTitle.bind(this);
    this.updateCommunique = this.updateCommunique.bind(this);
  }

  componentDidMount () {
    axios.get('/api/communique/')
    .then(res => res.data)
    .then(data => this.onLoad(data));
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return nextState === this.state //to fix
  // }

  onLoad (communique) {
    this.setState({ communique, allCommunique: communique });
  }

  selectCommunique (communiqueId) {
    axios.get(`/api/communique/${communiqueId}`)
      .then(res => res.data)
      .then(foundComm => {
        this.setState({
          selectedCommunique: foundComm,
        });
      })
      .catch(error => this.setState({ invalid: true }));  
  }

  searchByTitle (titleKeywords) {
    axios.get(`/api/communique/searchByTitle/${titleKeywords}`)
      .then(res => res.data)
      .then(results => this.setState({ communique: results, titleKeywords }))
    .catch(error => this.setState({ invalid: true }));  
  }

  searchByContent (contentKeywords) {
    axios.get(`/api/communique/searchByContent/${contentKeywords}`)
      .then(res => res.data)
      .then(result => this.setState({ communique: results, contentKeywords }))
    .catch(error => this.setState({ invalid: true }));  
  }

  filterLanguage (language) {
    const filtered = this.state.allCommunique.filter(communique => {
      return communique.language === language
    });
    this.setState({
      communique: filtered,
      language
    });
  }

  updateCommunique(updateEvent) {
    console.log(updateEvent);
  }

  render () {
    const props = Object.assign({}, this.state, {
      selectCommunique: this.selectCommunique,
      searchByContent: this.searchByContent,
      searchByTitle: this.searchByTitle,
      updateCommunique: this.updateCommunique,
    });

    if (this.state.invalid) {
      return (
        <div id="main" className="container-fluid">
          <MyNavbar />
          <NotFound />
        </div>
        )
    } else 
    return (
      <div id="main" className="container-fluid">
        <MyNavbar filterLanguage={this.filterLanguage}/>
        {
          this.props.children && React.cloneElement(this.props.children, props)
        }
      </div>
    );
  }
}
