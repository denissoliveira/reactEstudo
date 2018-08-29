import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import {Link} from 'react-router-dom';

const Layout = () => (
    <ul className="pure-menu-list">
        <li className="pure-menu-item"><Link to="#" className="pure-menu-link">Home</Link></li>
        <li className="pure-menu-item"><Link to="/autor" className="pure-menu-link">Autor</Link></li>
        <li className="pure-menu-item"><Link to="#" className="pure-menu-link">Livros</Link></li>
    </ul>
)

export default Header