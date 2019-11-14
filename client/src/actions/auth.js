import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "./constants";
//Import set alert to display all errors as danger alerts
import { setAlert } from "./alert";

//Register a user action
export const register = ({ name, email, password }) => async dispatch => {
  //Set request headers for axios request
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  //Create body for axios request
  const body = JSON.stringify({ name, email, password });

  try {
    console.log(
      process.env.REACT_APP_BASE_API_URL + process.env.REACT_APP_REGISTER_URL
    );
    const res = await axios.post(
      process.env.REACT_APP_BASE_API_URL + process.env.REACT_APP_REGISTER_URL,
      body,
      config
    );
    //Dispatch register success action
    if (!res) {
      //Dispatch error alert to display error message in alert
      dispatch(setAlert("Unable to register", "danger"));

      //Dispatch Registration failed action
      dispatch({
        type: REGISTER_FAIL
      });
    }
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    //Dispatch setAlert action to display errors in alert
    const errors = error.response.data.errors;
    console.log(errors);
    if (errors) {
      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    //Dispatch register fail action
    dispatch({
      type: REGISTER_FAIL
    });
  }
};
