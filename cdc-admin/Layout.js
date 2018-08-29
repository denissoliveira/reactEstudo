import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import Header from './Header';
import {Link} from 'react-router-dom';

const Layout = () => (
  <div id="layout">
      {/*Menu toggle*/}
      <a href="#menu" id="menuLink" className="menu-link">
          {/*Hamburger icon*/}
          <span></span>
      </a>

      <div id="menu">
          <div className="pure-menu">
              <a className="pure-menu-heading" href="//#">Company</a>
              <Header/>
          </div>
      </div>

      <div id="main">
        <div className="header">
          <h1>Bem Vindo ao Sistema</h1>
        </div>
        <br/>
        <div className="content" id="content">
          {this.props.children}
        </div>
      </div>
  </div>          
)

export default Layout;
