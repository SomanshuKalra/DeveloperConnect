import React from "react";
//import styled from "styled-components";
//import PropTypes from "prop-types";

// #region styled-components

// #endregion

// #region functions

// #endregion

// #region constants

// #endregion

// #region component
const propTypes = {};

const defaultProps = {};

/**
 *
 */
const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <a href="index.html">
          <i className="fas fa-code"></i> DevConnector
        </a>
      </h1>
      <ul>
        <li>
          <a href="profiles.html">Developers</a>
        </li>
        <li>
          <a href="register.html">Register</a>
        </li>
        <li>
          <a href="login.html">Login</a>
        </li>
      </ul>
    </nav>
  );
};

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;
// #endregion

export default Navbar;
