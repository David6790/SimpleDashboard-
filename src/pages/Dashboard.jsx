import React, { useState, useEffect } from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import PreviewTableDashboard from "../Components/PreviewTableDashboard";
import BanniereStat from "../Components/BanniereStat";

import { useGetReservationsByDateQuery } from "../services/reservations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ModalViewPlan from "./ModalViewPlan";
import ModalViewPlanMidi from "./ModalViewPlanMidi";
import { Switch } from "@headlessui/react";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalMidiOpen, setIsModalMidiOpen] = useState(false); // Pour le modal Midi
  const [isModalSoirOpen, setIsModalSoirOpen] = useState(false); // Pour le modal Soir
  const [filter, setFilter] = useState("all");
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  registerLocale("fr", fr);

  const {
    data: reservations,
    isError,
    error,
    refetch,
  } = useGetReservationsByDateQuery(formattedDate);

  const refreshReservations = () => {
    refetch();
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    const date = params.get("date");
    if (redirect === "true" && date) {
      setSelectedDate(new Date(date));
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  // Gérer l'ouverture des modals séparément
  const handleOpenMidiModal = () => {
    setIsModalMidiOpen(true);
  };

  const handleOpenSoirModal = () => {
    setIsModalSoirOpen(true);
  };

  // Gérer la fermeture des modals séparément
  const handleCloseMidiModal = () => {
    setIsModalMidiOpen(false);
  };

  const handleCloseSoirModal = () => {
    setIsModalSoirOpen(false);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredReservations = reservations
    ? reservations.filter((reservation) => {
        const reservationTime = parseInt(
          reservation.timeResa.replace(/:/g, ""),
          10
        );
        if (filter === "midi") {
          return reservationTime < 140000; // 14:00:00
        } else if (filter === "soir") {
          return reservationTime >= 140000; // 14:00:00 and onwards
        }
        return true; // 'all' filter shows all reservations
      })
    : [];

  return (
    <Layout>
      <SectionHeading title={"IL GIRASOLE"} />
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Réservations du :
            </label>
            <div className="flex items-center space-x-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                locale="fr"
                className="mt-2 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleOpenMidiModal} // Ouvrir le modal pour midi
                className="mt-2 block rounded-md bg-green-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Voir plan Midi
              </button>
              <button
                type="button"
                onClick={handleOpenSoirModal} // Ouvrir le modal pour soir
                className="mt-2 block rounded-md bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Voir plan Soir
              </button>
            </div>
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

      <BanniereStat
        reservations={filteredReservations}
        selectedDate={selectedDate}
      />

      {/* Toggle Filters */}
      <div className="mt-4 space-y-2 flex gap-4">
        <div className="flex items-center">
          <Switch
            checked={filter === "all"}
            onChange={() => handleFilterChange("all")}
            className={`${
              filter === "all" ? "bg-indigo-600" : "bg-gray-200"
            } group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
          >
            <span className="sr-only">Afficher toutes les réservations</span>
            <span
              aria-hidden="true"
              className={`${
                filter === "all" ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-3">Toutes les réservations</span>
        </div>

        <div className="flex items-center">
          <Switch
            checked={filter === "midi"}
            onChange={() => handleFilterChange("midi")}
            className={`${
              filter === "midi" ? "bg-indigo-600" : "bg-gray-200"
            } group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
          >
            <span className="sr-only">
              Afficher uniquement les réservations du midi
            </span>
            <span
              aria-hidden="true"
              className={`${
                filter === "midi" ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-3">Réservations du midi</span>
        </div>

        <div className="flex items-center">
          <Switch
            checked={filter === "soir"}
            onChange={() => handleFilterChange("soir")}
            className={`${
              filter === "soir" ? "bg-indigo-600" : "bg-gray-200"
            } group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
          >
            <span className="sr-only">
              Afficher uniquement les réservations du soir
            </span>
            <span
              aria-hidden="true"
              className={`${
                filter === "soir" ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-3">Réservations du soir</span>
        </div>
      </div>

      <PreviewTableDashboard
        reservations={filteredReservations}
        isError={isError}
        error={error}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        refreshReservations={refreshReservations}
      />

      {isModalMidiOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={handleCloseMidiModal}
            >
              X
            </button>
            <ModalViewPlanMidi
              date={formattedDate}
              period="midi"
              onClose={handleCloseMidiModal}
            />
          </div>
        </div>
      )}

      {isModalSoirOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={handleCloseSoirModal}
            >
              X
            </button>
            <ModalViewPlan
              date={formattedDate}
              period="soir"
              onClose={handleCloseSoirModal}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
