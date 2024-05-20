import { useState } from "react";
import { useGetReservationsByDateQuery } from "../services/reservations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "./Pagination";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

export default function PreviewTableDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const {
    data: reservations,
    isError,
    error,
  } = useGetReservationsByDateQuery(formattedDate);
  const [currentPage, setCurrentPage] = useState(1);

  // Calcul pour la pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations
    ? reservations.slice(indexOfFirstItem, indexOfLastItem)
    : null;
  const totalItems = reservations ? reservations.length : 0;

  return (
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
            minDate={new Date()}
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
      <div className="-mx-4 mt-8 sm:-mx-0">
        {isError && (
          <div className="text-center text-red-500">
            Une erreur s'est produite lors de la récupération des réservations :{" "}
            {error?.data || "Erreur inconnue"}
          </div>
        )}
        {!isError && currentItems && currentItems.length === 0 && (
          <div className="text-center text-gray-500">
            Pas de réservations pour cette date.
          </div>
        )}
        {currentItems && currentItems.length > 0 && (
          <>
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Nom
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Heure
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Couverts
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Téléphone
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.map((reservation) => (
                  <tr key={crypto.randomUUID()}>
                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                      {reservation.client.name +
                        " " +
                        reservation.client.prenom}
                      <dl className="font-normal lg:hidden">
                        <dt className="sr-only">Date</dt>
                        <dd className="mt-1 truncate text-gray-700">
                          {new Date(reservation.dateResa).toLocaleDateString()}
                        </dd>
                        <dt className="sr-only">Heure</dt>
                        <dd className="mt-1 truncate text-gray-500">
                          {reservation.timeResa.slice(0, -3)}
                        </dd>
                      </dl>
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {new Date(reservation.dateResa).toLocaleDateString()}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {reservation.timeResa}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      {reservation.numberOfGuest}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {reservation.client.telephone}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="google.com"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                        <span className="sr-only">, {reservation.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
