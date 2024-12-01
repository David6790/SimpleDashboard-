import React, { useState } from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import TableStockComplet from "../Components/TableStockComplet";
import TableResaCommentaireAttente from "../Components/TableResaCommentaireAttente";

const StockComplet = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSendEmails = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}Reservations/send-emails-future-confirmed`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'appel à l'API.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <SectionHeading title={"Réservations à traiter"} />
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="mt-4 sm:mt-0 sm:flex-none">
            <NavLink to={"/reservation-page"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Ajouter une réservation
              </button>
            </NavLink>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={handleSendEmails}
              className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              NE PAS TOUCHER
            </button>
          </div>
        </div>
        <TableStockComplet date={selectedDate} />
        <TableResaCommentaireAttente date={selectedDate} />
      </div>
    </Layout>
  );
};

export default StockComplet;
