import { SET_ALERT, REMOVE_ALERT } from "../actions/constants";
//Empty initial state
const initialState = [];

export default function(state = initialState, action) {
  //Destructure the actions object
  const { type, payload } = action;

  //Switch case for different alert types. SET_ALERT adds an alert, REMOVE_ALERT removes an alert
  switch (type) {
    case SET_ALERT:
      console.log("Inside alert.js of reducer");
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
