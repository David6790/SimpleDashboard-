import { useState } from "react";
import { useGetReservationsQuery } from "../services/reservations";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function PreviewTableDashboard() {
  const { data: reservations, error, isLoading } = useGetReservationsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcul pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = reservations.length;
  const pageNumbers = [];

  const totalPage = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Réservations du jour
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste des réservations de la journée courante.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Ajouter une réservation
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
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
                  {reservation.client.name + " " + reservation.client.prenom}
                  <dl className="font-normal lg:hidden">
                    {" "}
                    {/* Assurez-vous que ces détails ne sont visibles que sur les petits écrans */}
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
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit<span className="sr-only">, {reservation.name}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 lg:px-8 mt-10 flex justify-center">
          <div className=" flex items-center justify-center  bg-white px-4 py-3 sm:px-6">
            <button
              onClick={() =>
                setCurrentPage((currentPage) => Math.max(1, currentPage - 1))
              }
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`mx-1 px-4 py-2 text-sm font-medium ${
                  currentPage === number
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((currentPage) =>
                  Math.min(totalPage, currentPage + 1)
                )
              }
              disabled={currentPage === totalPage}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-700 m-auto   text-center">
          Affichage de {indexOfFirstItem + 1} à{" "}
          {Math.min(indexOfLastItem, totalItems)} sur {totalItems} résultats
        </div>
      </div>
    </div>
  );
}
