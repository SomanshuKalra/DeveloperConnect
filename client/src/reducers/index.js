/**
 * This js file combines different reducers like auth, profile etc.
 * for sharing state in different flows
 */
import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";

export default combineReducers({
  //All reducers to be combined go here
  alert,
  auth
});
