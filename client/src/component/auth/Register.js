import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//import styled from "styled-components";
//import PropTypes from "prop-types";
const propTypes = {};

const defaultProps = {};

const Register = () => {
  //Adding useState hook for formData (formData - previous state, setFormData - new state to be saved)
  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  //Define onSubmit action for form
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.log("Passwords do not match");
    } else {
      const newUser = {
        name,
        email,
        password,
        password2
      };

      try {
        console.log("inside on submit");
        const configuration = {
          headers: {
            "Content-Type": "application/json"
          }
        };

        const body = JSON.stringify(newUser);
        console.log("before making request");
        const res = await axios.post(
          process.env.REACT_APP_BASE_API_URL + "/api/users/register",
          body,
          configuration
        );
        console.log(res);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  //Method to update state.
  const onChange = e =>
    setformData({ ...formData, [e.target.name]: e.target.value });

  //Destructuring input formData
  const { name, email, password, password2 } = formData;
  return (
    <React.Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </React.Fragment>
  );
};

Register.propTypes = propTypes;
Register.defaultProps = defaultProps;
// #endregion

export default Register;