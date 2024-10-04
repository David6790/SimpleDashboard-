import React, { useState } from "react";
import {
  useGetUntreatedReservationsQuery,
  useValidateReservationMutation,
  useRefuseReservationMutation,
} from "../services/reservations";
import { useGetNotificationToggleQuery } from "../services/toggleApi"; // Import du hook pour le toggle
import ReservationSlideOver from "./ReservationSlideOver";

export default function TableReservations() {
  const {
    data: reservations,
    error,
    isLoading,
    refetch: refetchReservations, // Refetch pour les réservations
  } = useGetUntreatedReservationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    refetch: refetchToggle, // Refetch pour le toggle
  } = useGetNotificationToggleQuery(); // Appel de l'API toggle

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showConfirmationOptions, setShowConfirmationOptions] = useState(null);

  const [validateReservation] = useValidateReservationMutation();
  const [refuseReservation] = useRefuseReservationMutation();

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

  const handleFinalConfirmation = async (id) => {
    try {
      await validateReservation(id).unwrap(); // Validation de la réservation
      setShowConfirmationOptions(null);

      // Refetch les données de notification après la validation
      await refetchToggle(); // Rafraîchir l'état du toggle
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  const handleRejectClick = async (id) => {
    try {
      await refuseReservation({ id, user: "current_user" }).unwrap();
      setShowConfirmationOptions(null);
      refetchReservations(); // Rafraîchir les réservations après le refus
    } catch (error) {
      console.error("Failed to refuse reservation:", error);
    }
  };

  const handleBackClick = () => {
    setShowConfirmationOptions(null);
  };

  const gestionResa = (status, reservation) => {
    if (status === "C") {
      openSlideOver(reservation);
    }
  };

  return (
    <div>
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
            {reservations &&
              reservations.map((reservation) => (
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
                    {reservation.status === "C" ? (
                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          gestionResa(reservation.status, reservation);
                        }}
                      >
                        Modifier
                      </button>
                    ) : reservation.status === "P" ||
                      reservation.status === "M" ? (
                      showConfirmationOptions === reservation.id ? (
                        <>
                          <button
                            className="px-4 py-2 mr-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFinalConfirmation(reservation.id);
                            }}
                          >
                            Par Email
                          </button>
                          <button
                            className="px-4 py-2 mr-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Par Mail & SMS
                          </button>
                          <button
                            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBackClick();
                            }}
                          >
                            Retour
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-4 py-2 mr-2 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmClick(reservation);
                            }}
                          >
                            Confirmer
                          </button>
                          <button
                            className="px-4 py-2 rounded-md text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectClick(reservation.id);
                            }}
                          >
                            Refuser
                          </button>
                        </>
                      )
                    ) : null}
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
