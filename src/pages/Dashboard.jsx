import React, { useState, useEffect } from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import PreviewTableDashboard from "../Components/PreviewTableDashboard";
import BanniereStat from "../Components/BanniereStat";
import MenuDuJour from "../Components/MenuDuJour";
import { useGetReservationsByDateQuery } from "../services/reservations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const {
    data: reservations,
    isError,
    error,
  } = useGetReservationsByDateQuery(formattedDate);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    const date = params.get("date");
    if (redirect === "true" && date) {
      setSelectedDate(new Date(date));
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <Layout>
      <SectionHeading title={"IL GIRASOLE"} />
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Réservations du :
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="mt-2 text-sm text-gray-700">
              Liste des réservations du : {format(selectedDate, "dd/MM/yyyy")}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <NavLink to={"/reservation-page"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Ajouter une réservation
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <BanniereStat reservations={reservations} selectedDate={selectedDate} />
      <PreviewTableDashboard
        reservations={reservations}
        isError={isError}
        error={error}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <MenuDuJour />
    </Layout>
  );
};

export default Dashboard;
