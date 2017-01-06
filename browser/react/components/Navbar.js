import React, { Component } from 'react';
import { Link } from 'react-router';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

export default class MyNavbar extends Component {

  constructor(props){
    super(props);
    // this.state = {
    // 	contentKeywords: '',
    // 	titleKeywords: '',
    // };
    // this.handleContentChange = this.handleContentChange.bind(this);
    // this.handleContentSubmit = this.handleContentSubmit.bind(this);    
    // this.handleTitleChange = this.handleTitleChange.bind(this);
    // this.handleTitleSubmit = this.handleTitleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <Navbar>
          <NavbarBrand href="/">和谐河蟹</NavbarBrand>
          <Nav className="float-xs-right" navbar>
            <NavItem>
              <NavLink onClick={() => this.props.filterLanguage('English')}>view English only</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => this.props.filterLanguage('中文')}>view Chinese only</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/csjiang/harmonious-crab"><span className="glyphicon glyphicon-heart"></span></NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
};