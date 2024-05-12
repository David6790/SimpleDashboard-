import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ReservationPage from "../pages/ReservationPage";

const Routeur = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reservation-page" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routeur;
