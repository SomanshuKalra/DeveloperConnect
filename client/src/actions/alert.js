import { SET_ALERT, REMOVE_ALERT } from "./constants";
import uuid from "uuid";

//Method to dispatch actions for different alerts
export const setAlert = (msg, alertType) => dispatch => {
  //Create a random unique id
  const id = uuid.v4();
  console.log("Inside setAlert of actions, dispatching alert");
  //Dispatch the alert using a dispatcher
  //Generic for all types of alerts
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  //Call setTimeout to remove alert after 5 seconds
  setTimeout(() => {
    //Dispatch the alert
    dispatch({
      type: REMOVE_ALERT,
      payload: id
    });
  }, 5000);
};
