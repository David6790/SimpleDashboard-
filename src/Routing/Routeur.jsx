import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ReservationPage from "../pages/ReservationPage";
import UpdateResaForm from "../Components/UpdateResaForm";

const Routeur = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reservation-page" element={<ReservationPage />} />
        <Route path="/reservation-update" element={<UpdateResaForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routeur;
