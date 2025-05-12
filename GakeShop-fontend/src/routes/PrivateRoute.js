import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.gakeReducer.userInfo);
  return userInfo && userInfo.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
