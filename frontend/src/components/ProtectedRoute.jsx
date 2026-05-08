import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isSessionAuthenticated } from "../utils/authSession";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isSessionAuthenticated()) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;