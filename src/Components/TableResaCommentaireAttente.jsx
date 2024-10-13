import React, { useState, useEffect } from "react";
import { useGetReservationsWithClientCommentsQuery } from "../services/reservations"; // Hook pour les réservations avec commentaires
import ReservationSlideOver from "./ReservationSlideOver";
import { useNavigate } from "react-router-dom";

export default function TableResaCommentaireAttente({ date }) {
  const {
    data: reservations,
    error,
    isLoading,
    refetch: refetchReservations, // Refetch pour les réservations
  } = useGetReservationsWithClientCommentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showConfirmationOptions, setShowConfirmationOptions] = useState(null);

  const [filteredReservations, setFilteredReservations] = useState([]);

  const navigate = useNavigate();

  // Utilisation d'un effet pour filtrer les réservations en fonction de la date sélectionnée
  useEffect(() => {
    if (reservations) {
      if (date) {
        const selectedDate = new Date(date).toLocaleDateString();
        const filtered = reservations.filter((reservation) => {
          const reservationDate = new Date(
            reservation.dateResa
          ).toLocaleDateString();
          return reservationDate === selectedDate;
        });
        setFilteredReservations(filtered);
      } else {
        // Si aucune date n'est sélectionnée, afficher toutes les réservations
        setFilteredReservations(reservations);
      }
    }
  }, [date, reservations]); // Réagir aux changements de date ou de réservations

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>Error loading reservations: {error?.data || "Unknown error"}</div>
    );

  const openSlideOver = (reservation) => {
    setSelectedReservation(reservation);
    setIsSlideOverOpen(true);
  };

  const closeSlideOver = () => {
    setIsSlideOverOpen(false);
    setSelectedReservation(null);
  };

  const handleConfirmClick = (reservation) => {
    setShowConfirmationOptions(reservation.id);
  };

  const handleReplyClick = (reservationId) => {
    console.log("Répondre à la réservation:", reservationId);
    navigate(`/gir-staff/${reservationId}`);
  };

  return (
    <div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
          Communication Client en attente
        </h2>
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
                État
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Action
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredReservations &&
              filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                  onClick={() => openSlideOver(reservation)}
                >
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {reservation.client.name + " " + reservation.client.prenom}
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
                  <td className="whitespace-nowrap px-3 py-5 text-sm font-medium">
                    <button className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                      {reservation.notifications}{" "}
                    </button>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReplyClick(reservation.id);
                      }}
                    >
                      Répondre
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ReservationSlideOver
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        reservation={selectedReservation}
      />
    </div>
  );
}
