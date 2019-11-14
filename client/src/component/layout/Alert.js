/**
 * Alert component to be rendered by React
 */

import React from "react";
import PropTypes from "prop-types";

//Import connect to whenever you want a component to interact with redux (calling an action or getting a state)
import { connect } from "react-redux";

const propTypes = {
  alerts: PropTypes.array.isRequired
};

const defaultProps = {};

/**
 *
 */
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

console.log("Inside alert component");
//Fetch alert from root reducer
//By doing this, we will have alert as a prop
const mapStateToProps = state => ({
  alerts: state.alert
});
Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;

export default connect(mapStateToProps)(Alert);
