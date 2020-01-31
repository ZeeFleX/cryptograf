import React from "react";
import UserStore from "stores/User.store.js";
import { Route, Redirect } from "react-router";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  function loggedIn() {
    const storageToken = window.localStorage.getItem("token");
    const userToken = UserStore.data.token;
    if (!userToken && !storageToken) {
      return false;
    } else {
      return true;
    }
  }
  return (
    <Route
      {...rest}
      render={props =>
        loggedIn() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};
