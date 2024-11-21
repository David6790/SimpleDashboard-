import React, { useState } from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import PreviewTableDashboard from "../Components/PreviewTableDashboard";
import {
  useGetFilteredReservationsQuery,
  useGetLatestReservationsQuery,
} from "../services/reservations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

registerLocale("fr", fr);

const PageStockCompletResa = () => {
  const [mode, setMode] = useState(""); // '' (aucun), 'latest' ou 'search'
  const [latestLimit, setLatestLimit] = useState(10); // Limite par défaut pour les dernières réservations
  const [tempFilters, setTempFilters] = useState({
    startDate: null,
    endDate: null,
    status: "",
    clientSearch: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [latestTrigger, setLatestTrigger] = useState(false); // Trigger pour la recherche des dernières réservations

  // Récupération des dernières réservations
  const {
    data: latestReservations,
    isLoading: isLoadingLatest,
    error: errorLatest,
  } = useGetLatestReservationsQuery(latestLimit, {
    skip: mode !== "latest" || !latestTrigger,
  });

  // Récupération des réservations filtrées
  const {
    data: filteredReservations,
    isLoading: isLoadingFiltered,
    error: errorFiltered,
  } = useGetFilteredReservationsQuery(appliedFilters, {
    skip: mode !== "search" || !Object.keys(appliedFilters).length,
  });

  // Gestion des changements dans le formulaire de recherche
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempFilters({
      ...tempFilters,
      [name]: value,
    });
  };

  const handleDateChange = (date, fieldName) => {
    setTempFilters({
      ...tempFilters,
      [fieldName]: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatLocalDate = (date) => {
      if (!date) return "";
      const offsetDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return offsetDate.toISOString().split("T")[0];
    };
    const formattedFilters = {
      ...tempFilters,
      startDate: formatLocalDate(tempFilters.startDate),
      endDate: formatLocalDate(tempFilters.endDate),
    };
    setAppliedFilters(formattedFilters);
    setMode("search");
  };

  const handleLatestSubmit = (e) => {
    e.preventDefault();
    setLatestTrigger(true);
  };

  // Fonctions pour calculer les statistiques
  const calculateTotalReservations = (reservations) =>
    reservations ? reservations.length : 0;

  const calculateTotalGuests = (reservations) =>
    reservations
      ? reservations.reduce(
          (acc, reservation) => acc + (reservation.numberOfGuest || 0),
          0
        )
      : 0;

  const calculateTotalGuestsMidi = (reservations) =>
    reservations
      ? reservations
          .filter(
            (reservation) =>
              reservation.timeResa && reservation.timeResa <= "14:00"
          )
          .reduce(
            (acc, reservation) => acc + (reservation.numberOfGuest || 0),
            0
          )
      : 0;

  const calculateTotalGuestsSoir = (reservations) =>
    reservations
      ? reservations
          .filter(
            (reservation) =>
              reservation.timeResa && reservation.timeResa >= "19:00"
          )
          .reduce(
            (acc, reservation) => acc + (reservation.numberOfGuest || 0),
            0
          )
      : 0;

  const calculatePercentageMidi = (totalGuestsMidi, totalGuests) =>
    totalGuests > 0 ? ((totalGuestsMidi / totalGuests) * 100).toFixed(2) : 0;

  const calculatePercentageSoir = (totalGuestsSoir, totalGuests) =>
    totalGuests > 0 ? ((totalGuestsSoir / totalGuests) * 100).toFixed(2) : 0;

  const calculateAverageGuests = (totalGuests, totalReservations) =>
    totalReservations > 0
      ? (totalGuests / totalReservations).toFixed(2)
      : "N/A";

  // Calcul des statistiques (uniquement si des réservations sont retournées)
  const totalReservations = calculateTotalReservations(filteredReservations);
  const totalGuests = calculateTotalGuests(filteredReservations);
  const totalGuestsMidi = calculateTotalGuestsMidi(filteredReservations);
  const totalGuestsSoir = calculateTotalGuestsSoir(filteredReservations);
  const percentageMidi = calculatePercentageMidi(totalGuestsMidi, totalGuests);
  const percentageSoir = calculatePercentageSoir(totalGuestsSoir, totalGuests);
  const averageGuests = calculateAverageGuests(totalGuests, totalReservations);

  return (
    <Layout>
      <SectionHeading title="Gestion des réservations" />
      <div className="mx-10 mt-10">
        {/* Choix du mode */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => {
              setMode("latest");
              setLatestTrigger(false);
            }}
            className={`py-2 px-4 rounded-lg text-white font-medium ${
              mode === "latest"
                ? "bg-indigo-700"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            Afficher les dernières réservations
          </button>
          <button
            onClick={() => setMode("search")}
            className={`py-2 px-4 rounded-lg text-white font-medium ${
              mode === "search"
                ? "bg-indigo-700"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            Rechercher dans la base
          </button>
        </div>

        {/* Section des dernières réservations */}
        {mode === "latest" && (
          <div className="p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dernières réservations
            </h3>
            <form
              onSubmit={handleLatestSubmit}
              className="flex items-center gap-4"
            >
              <label className="block text-sm font-medium text-gray-700">
                Nombre de réservations à afficher :
              </label>
              <input
                type="number"
                value={latestLimit}
                onChange={(e) => setLatestLimit(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                min={1}
              />
              <button
                type="submit"
                className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
              >
                Valider
              </button>
            </form>
            {isLoadingLatest && <p>Chargement des dernières réservations...</p>}
            {errorLatest && (
              <p className="text-red-500">
                Erreur : {errorLatest.message || "Impossible de charger"}
              </p>
            )}
            {latestReservations && (
              <PreviewTableDashboard reservations={latestReservations} />
            )}
          </div>
        )}

        {/* Section recherche dans la base */}
        {mode === "search" && (
          <>
            <form
              className="p-5 rounded-lg shadow-md mb-5"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Plage de dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de début
                  </label>
                  <DatePicker
                    selected={tempFilters.startDate}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    dateFormat="dd/MM/yyyy"
                    locale="fr"
                    placeholderText="Choisir une date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de fin
                  </label>
                  <DatePicker
                    selected={tempFilters.endDate}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    dateFormat="dd/MM/yyyy"
                    locale="fr"
                    placeholderText="Choisir une date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500"
                  />
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={tempFilters.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500"
                  >
                    <option value="">Tous</option>
                    <option value="C">Confirmé</option>
                    <option value="P">En attente</option>
                    <option value="A">Annulé</option>
                    <option value="R">Refusé</option>
                  </select>
                </div>

                {/* Recherche client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom ou prénom du client
                  </label>
                  <input
                    type="text"
                    name="clientSearch"
                    value={tempFilters.clientSearch}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500"
                    placeholder="Rechercher un client"
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="mt-5">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                >
                  Appliquer les filtres
                </button>
              </div>
            </form>

            {/* Statistiques */}
            {filteredReservations && filteredReservations.length > 0 && (
              <div className="mt-5 mx-8 mb-10">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-5">
                  Statistiques
                </h3>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Nombre total de réservations
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {totalReservations}
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Nombre de couverts à midi
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {totalGuestsMidi}
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Nombre de couverts le soir
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {totalGuestsSoir}
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Pourcentage à midi
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {percentageMidi}%
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Pourcentage le soir
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {percentageSoir}%
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Moyenne de couverts par réservation
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {averageGuests}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Résultats filtrés */}
            {isLoadingFiltered && <p>Chargement des réservations...</p>}
            {errorFiltered && (
              <p className="text-red-500">
                Erreur : {errorFiltered.message || "Impossible de charger"}
              </p>
            )}
            {filteredReservations && (
              <PreviewTableDashboard reservations={filteredReservations} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default PageStockCompletResa;
