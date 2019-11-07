import React, { useState } from "react";
import { Link } from "react-router-dom";
//import styled from "styled-components";
//import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

/**
 *
 */
const Login = () => {
  //Adding useState hook for formData (formData - previous state, setFormData - new state to be saved)
  const [formData, setformData] = useState({
    email: "",
    password: ""
  });

  //Define onSubmit action for form
  const onSubmit = async e => {
    e.preventDefault();
    console.log("Success!!!!");
  };

  //Method to update state.
  const onChange = e =>
    setformData({ ...formData, [e.target.name]: e.target.value });

  //Destructuring input formData
  const { email, password } = formData;
  return (
    <React.Fragment>
      <div className="alert alert-danger">Invalid credentials</div>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => onChange(e)}
            value={password}
            required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </React.Fragment>
  );
};

Login.propTypes = propTypes;
Login.defaultProps = defaultProps;
// #endregion

export default Login;
