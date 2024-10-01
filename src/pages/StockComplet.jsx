import React, { useState } from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import TableStockComplet from "../Components/TableStockComplet";

const StockComplet = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Layout>
      <SectionHeading title={"Réservations à traiter"} />
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Date :
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
        <TableStockComplet />
      </div>
    </Layout>
  );
};

export default StockComplet;
