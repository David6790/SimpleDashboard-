import React, { useState } from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import PreviewTableDashboard from "../Components/PreviewTableDashboard";
import { useGetFilteredReservationsQuery } from "../services/reservations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

registerLocale("fr", fr);

const PageStockCompletResa = () => {
  const [tempFilters, setTempFilters] = useState({
    startDate: null,
    endDate: null,
    status: "",
    clientSearch: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const {
    data: reservations,
    isLoading,
    error,
  } = useGetFilteredReservationsQuery(appliedFilters, {
    skip: !Object.keys(appliedFilters).length,
  });

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

    // Formater les dates en tenant compte du fuseau horaire local
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
  };

  // Calcul des statistiques
  const totalGuests = reservations
    ? reservations.reduce(
        (acc, reservation) => acc + (reservation.numberOfGuest || 0),
        0
      )
    : 0;

  const totalGuestsMidi = reservations
    ? reservations
        .filter(
          (reservation) =>
            reservation.timeResa && reservation.timeResa <= "14:00"
        )
        .reduce((acc, reservation) => acc + (reservation.numberOfGuest || 0), 0)
    : 0;

  const totalGuestsSoir = reservations
    ? reservations
        .filter(
          (reservation) =>
            reservation.timeResa && reservation.timeResa >= "19:00"
        )
        .reduce((acc, reservation) => acc + (reservation.numberOfGuest || 0), 0)
    : 0;

  const totalReservations = reservations ? reservations.length : 0;

  // Pourcentages
  const percentageMidi =
    totalGuests > 0 ? ((totalGuestsMidi / totalGuests) * 100).toFixed(2) : 0;
  const percentageSoir =
    totalGuests > 0 ? ((totalGuestsSoir / totalGuests) * 100).toFixed(2) : 0;

  // Nombre moyen de couverts par réservation
  const averageGuests =
    totalReservations > 0
      ? (totalGuests / totalReservations).toFixed(2)
      : "N/A";

  return (
    <Layout>
      <SectionHeading title={"Stock complet des réservations"} />
      <div className="mx-10">
        <form
          className="bg-gray-100 p-5 rounded-lg shadow-md mb-5 mt-5"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Tous</option>
                <option value="C">Confirmé</option>
                <option value="P">En attente</option>
                <option value="A">Annulé</option>
                <option value="R">Refusé</option>
              </select>
            </div>

            {/* Recherche sur nom ou prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom ou prénom du client
              </label>
              <input
                type="text"
                name="clientSearch"
                value={tempFilters.clientSearch}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher un client"
              />
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="mt-5">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Appliquer les filtres
            </button>
          </div>
        </form>

        {/* Div pour afficher les statistiques */}
        {reservations && reservations.length > 0 && (
          <div className="mt-5 mx-8 mb-10">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-5">
              Statistiques
            </h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
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
                  Nombre de couverts total
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {totalGuests}
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Pourcentage des couverts à midi
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {percentageMidi}%
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Pourcentage des couverts le soir
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

        {/* Composant de tableau */}
        {isLoading && <p>Chargement des réservations...</p>}
        {error && <p>Erreur lors du chargement : {error.message}</p>}
        {reservations ? (
          <PreviewTableDashboard reservations={reservations} />
        ) : (
          !isLoading && <p>Aucune réservation trouvée.</p>
        )}
      </div>
    </Layout>
  );
};

export default PageStockCompletResa;
