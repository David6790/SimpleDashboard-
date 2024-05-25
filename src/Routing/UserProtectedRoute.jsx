import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ element: Component }) => {
  const user = useSelector((state) => state.user);
  return user ? <Component /> : <Navigate to="/sign-in" />;
};

export default UserProtectedRoute;
