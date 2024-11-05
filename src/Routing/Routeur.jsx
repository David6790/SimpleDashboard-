import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import Dashboard from "../pages/Dashboard";
import ReservationPage from "../pages/ReservationPage";
import UpdateResaForm from "../Components/UpdateResaForm";
import SignIn from "../Components/SignIn";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import { setUser } from "../slices/userSlice";
import UserProtectedRoute from "./UserProtectedRoute"; // Assurez-vous d'importer correctement
import RoleProtectedRoute from "./RoleProtectedRoute"; // Assurez-vous d'importer correctement
import OccStatusManagement from "../pages/OccStatusManagement";
import PlanDeSalle from "../pages/PlanDeSalle";
import StockComplet from "../pages/StockComplet";
import GestionInteractiveResa from "../pages/GestionInteractiveResa";
import UpdateResaFormClient from "../Components/UpdateResaFormClient";
import GirStaff from "../pages/GirStaff";
import UserList from "../pages/UserList";
import ResaExternesClients from "../pages/ResaExternesClients";

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
          path="/admin-stockComplet"
          element={
            <RoleProtectedRoute
              element={StockComplet}
              allowedRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/reservation-page"
          element={<UserProtectedRoute element={ReservationPage} />}
        />
        <Route path="/plan" element={<PlanDeSalle />} />
        <Route
          path="/reservation-update"
          element={<UserProtectedRoute element={UpdateResaForm} />}
        />
        <Route
          path="/sign-in"
          element={user ? <Navigate to="/" /> : <SignIn />}
        />
        {/* Utilisez RoleProtectedRoute pour les routes qui nécessitent des rôles spécifiques */}
        <Route
          path="/manager-dashboard"
          element={
            <RoleProtectedRoute
              element={Dashboard}
              allowedRoles={["manager", "admin"]}
            />
          }
        />
        <Route
          path="/admin-occstat"
          element={
            <RoleProtectedRoute
              element={OccStatusManagement}
              allowedRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/user-admin"
          element={
            <RoleProtectedRoute element={UserList} allowedRoles={["ADMIN"]} />
          }
        />

        {/* Ajouter la route pour la page Access Denied */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="/plansalle" element={<PlanDeSalle />} />
        <Route
          path="/gir/:reservationId"
          element={<GestionInteractiveResa />}
        />
        <Route path="/gir-staff/:reservationId" element={<GirStaff />} />
        <Route path="/modif-resa-client" element={<UpdateResaFormClient />} />
        <Route path="/resa-externe" element={<ResaExternesClients />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routeur;
