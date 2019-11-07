import React, { Fragment } from "react";
import Navbar from "./component/layout/Navbar";
import Landing from "./component/layout/Landing";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import dotenv from "dotenv";

//Import provider to connect react app with redux
import { Provider } from "react-redux";
import store from "./store";
dotenv.config();

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
