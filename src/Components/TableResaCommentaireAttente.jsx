import React, { useState, useEffect } from "react";
import { useGetReservationsWithClientCommentsQuery } from "../services/reservations";
import ReservationSlideOver from "./ReservationSlideOver";
import { useNavigate } from "react-router-dom";

export default function TableResaCommentaireAttente({ date }) {
  const {
    data: reservations,
    error,
    isLoading,
    refetch: refetchReservations,
  } = useGetReservationsWithClientCommentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [filteredReservations, setFilteredReservations] = useState([]);

  const navigate = useNavigate();

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
        setFilteredReservations(reservations);
      }
    }
  }, [date, reservations]);

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
              {/* Nom */}
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-0 text-sm sm:text-base"
              >
                Nom
              </th>
              {/* Date */}
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 lg:table-cell text-sm"
              >
                Date
              </th>
              {/* Heure */}
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 lg:table-cell text-sm"
              >
                Heure
              </th>
              {/* Couverts */}
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 sm:table-cell text-sm"
              >
                Couverts
              </th>
              {/* Téléphone */}
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 sm:table-cell text-sm"
              >
                Téléphone
              </th>
              {/* Date & Heure (mobile) */}
              <th
                scope="col"
                className="px-3 py-3.5 text-left font-semibold text-gray-900 sm:hidden text-xs"
              >
                Date &amp; Heure
              </th>
              {/* État */}
              <th
                scope="col"
                className="px-3 py-3.5 text-left font-semibold text-gray-900 w-16 text-sm sm:text-base"
              >
                État
              </th>
              {/* Action */}
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 font-semibold text-gray-900 sm:pr-0 text-sm sm:text-base"
              >
                Action
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
                  {/* Nom et Nombre de personnes */}
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0 text-sm sm:text-base">
                    {reservation.client.name}
                    <div className="sm:hidden text-gray-500">
                      {reservation.numberOfGuest} p
                    </div>
                  </td>
                  {/* Date */}
                  <td className="hidden px-3 py-4 text-gray-500 lg:table-cell text-sm">
                    {new Date(reservation.dateResa).toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </td>
                  {/* Heure */}
                  <td className="hidden px-3 py-4 text-gray-500 lg:table-cell text-sm">
                    {reservation.timeResa}
                  </td>
                  {/* Couverts */}
                  <td className="hidden px-3 py-4 text-gray-500 sm:table-cell text-sm">
                    {reservation.numberOfGuest}
                  </td>
                  {/* Téléphone */}
                  <td className="hidden px-3 py-4 text-gray-500 sm:table-cell text-sm">
                    {reservation.client.telephone}
                  </td>
                  {/* Date & Heure (mobile) */}
                  <td className="px-3 py-4 text-gray-500 sm:hidden text-xs break-words">
                    {new Date(reservation.dateResa).toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                    <br />
                    {reservation.timeResa.slice(0, -3)}
                  </td>
                  {/* État */}
                  <td className="px-3 py-5 font-medium w-16 break-words text-sm sm:text-base">
                    <button className="px-1 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs sm:text-sm">
                      {reservation.notifications}
                    </button>
                  </td>
                  {/* Actions */}
                  <td className="py-4 pl-3 pr-4 font-medium sm:pr-0 align-middle">
                    <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-x-1 md:justify-end">
                      <button
                        className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReplyClick(reservation.id);
                        }}
                      >
                        Répondre
                      </button>
                      <button
                        className="hidden md:inline-block px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-transparent text-transparent"
                        style={{ visibility: "hidden" }}
                      >
                        Répond
                      </button>
                      <button
                        className="hidden md:inline-block px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-transparent text-transparent"
                        style={{ visibility: "hidden" }}
                      >
                        Répon
                      </button>
                    </div>
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
