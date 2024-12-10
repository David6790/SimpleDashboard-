import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  useGetUntreatedReservationsQuery,
  useGetReservationsWithClientCommentsQuery,
} from "../services/reservations"; // Importez la requête
import { setHasNotification } from "../slices/notificationSlice"; // Importez l'action pour mettre à jour hasNotification
import Dashboard from "../pages/Dashboard";
import ReservationPage from "../pages/ReservationPage";
import UpdateResaForm from "../Components/UpdateResaForm";
import SignIn from "../Components/SignIn";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import { setUser } from "../slices/userSlice";
import UserProtectedRoute from "./UserProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import OccStatusManagement from "../pages/OccStatusManagement";
import PlanDeSalle from "../pages/PlanDeSalle";
import StockComplet from "../pages/StockComplet";
import GestionInteractiveResa from "../pages/GestionInteractiveResa";
import UpdateResaFormClient from "../Components/UpdateResaFormClient";
import GirStaff from "../pages/GirStaff";
import UserList from "../pages/UserList";
import ResaExternesClients from "../pages/ResaExternesClients";
import PowerUserPage from "../pages/PowerUserPage";
import PowerUpdateForm from "../Components/PowerUpdateForm";
import PageStockCompletResa from "../pages/PageStockCompletResa";
import SyntheseResa from "../pages/SyntheseResa";
import AccesDeniedClient from "../pages/AccesDeniedClient";
import PROCOM from "../pages/PROCOM";
import ProcomMain from "../pages/ProcomMain";

const Routeur = () => {
  const dispatch = useDispatch();

  // Récupérer les informations utilisateur depuis les cookies
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

  // Appel API pour récupérer les réservations non traitées
  const { data: reservations } = useGetUntreatedReservationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: comment } = useGetReservationsWithClientCommentsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Mettre à jour le state global `hasNotification` en fonction des réservations
  useEffect(() => {
    if (
      (reservations && reservations.length > 0) ||
      (comment && comment.length > 0)
    ) {
      dispatch(setHasNotification(true));
    } else {
      dispatch(setHasNotification(false));
    }
  }, [reservations, comment, dispatch]);

  const user = useSelector((state) => state.user);
  const role22 = useSelector((state) => state.user?.role);

  console.log(user);
  console.log("voici role >" + role22);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin-stockComplet"
          element={
            user && role22 === "ADMIN" ? <StockComplet /> : <AccessDeniedPage />
          }
        />
        <Route
          path="/procom-home"
          element={
            user && role22 === "ADMIN" ? <PROCOM /> : <AccessDeniedPage />
          }
        />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/gir-staff/:reservationId"
          element={user ? <GirStaff /> : <AccessDeniedPage />}
        />
        <Route
          path="/stockResa"
          element={user ? <PageStockCompletResa /> : <AccessDeniedPage />}
        />
        <Route
          path="/resasynth/:reservationId"
          element={user ? <SyntheseResa /> : <AccesDeniedClient />}
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
          path="/power-update"
          element={<UserProtectedRoute element={PowerUpdateForm} />}
        />
        <Route
          path="/sign-in"
          element={user ? <Navigate to="/" /> : <SignIn />}
        />
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
          path="/power-user"
          element={
            <RoleProtectedRoute
              element={PowerUserPage}
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
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="/plansalle" element={<PlanDeSalle />} />
        <Route
          path="/gir/:reservationId"
          element={<GestionInteractiveResa />}
        />
        <Route path="/modif-resa-client" element={<UpdateResaFormClient />} />
        <Route path="/resa-externe" element={<ResaExternesClients />} />
        <Route path="/procom-main/:reservationId" element={<ProcomMain />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routeur;
