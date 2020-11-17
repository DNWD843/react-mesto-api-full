import React from "react";
import { Route, Redirect } from "react-router-dom";
import { SIGNIN } from "../utils/routesMap";

const ProtectedRoute = ({ component: Component, ...props }) => {
  return (
    <Route>
      {() =>
        props.loggedIn ? <Component {...props} /> : <Redirect to={SIGNIN} />
      }
    </Route>
  );
};

export default ProtectedRoute;
