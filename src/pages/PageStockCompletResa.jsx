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
    clientSearch: "", // Nouveau champ pour la recherche sur nom ou prénom
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
