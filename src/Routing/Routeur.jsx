import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import Dashboard from "../pages/Dashboard";
import ReservationPage from "../pages/ReservationPage";
import UpdateResaForm from "../Components/UpdateResaForm";
import SignIn from "../Components/SignIn";
import { setUser } from "../slices/userSlice";

const ProtectedRoute = ({ element: Component }) => {
  const user = useSelector((state) => state.user);
  return user ? <Component /> : <Navigate to="/sign-in" />;
};

const Routeur = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    const username = Cookies.get("username");
    const email = Cookies.get("email");
    const role = Cookies.get("role");

    if (token && username && email && role) {
      // Dispatch user information to the Redux store
      dispatch(setUser({ username, email, role }));
    }
  }, [dispatch]);

  const user = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/reservation-page"
          element={<ProtectedRoute element={ReservationPage} />}
        />
        <Route
          path="/reservation-update"
          element={<ProtectedRoute element={UpdateResaForm} />}
        />
        <Route
          path="/sign-in"
          element={user ? <Navigate to="/" /> : <SignIn />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routeur;
