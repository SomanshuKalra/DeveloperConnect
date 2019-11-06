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
const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div class="landing-inner">
          <h1 class="x-large">Developer Connector</h1>
          <p class="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div class="buttons">
            <a href="register.html" class="btn btn-primary">
              Sign Up
            </a>
            <a href="login.html" class="btn btn-light">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = propTypes;
Landing.defaultProps = defaultProps;
// #endregion

export default Landing;
