import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ element: Component, allowedRoles }) => {
  const user = useSelector((state) => state.user);
  const userRole = user?.role;

  return user ? (
    allowedRoles.includes(userRole) ? (
      <Component />
    ) : (
      <Navigate to="/access-denied" />
    )
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default RoleProtectedRoute;
