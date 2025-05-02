import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";

const PrivateRoute = ({ children }) => {
  const { user, isLoading, isError } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Spinner/>; 
  }

  if (isError) {
    return <Navigate to="/login" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
