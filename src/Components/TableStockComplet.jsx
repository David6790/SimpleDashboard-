import React, { useState, useEffect } from "react";
import {
  useGetUntreatedReservationsQuery,
  useValidateReservationMutation,
  useRefuseReservationMutation,
} from "../services/reservations";

import ReservationSlideOver from "./ReservationSlideOver";
import RequestProcessingModal from "./RequestProcessingModal";
import ConfirmationAnnulerModal from "./ConfirmationAnnulerModal";
import ModalViewPlan from "../pages/ModalViewPlan";
import ModalViewPlanMidi from "../pages/ModalViewPlanMidi";

export default function TableReservations({ date }) {
  // États existants
  const {
    data: reservations,
    error,
    isLoading,
    refetch: refetchReservations,
  } = useGetUntreatedReservationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showConfirmationOptions, setShowConfirmationOptions] = useState(null);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationAnnulationModalOpen] =
    useState(false);

  const [validateReservation] = useValidateReservationMutation();
  const [refuseReservation] = useRefuseReservationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour les modales
  const [isModalMidiOpen, setIsModalMidiOpen] = useState(false);
  const [isModalSoirOpen, setIsModalSoirOpen] = useState(false);
  const [selectedReservationDate, setSelectedReservationDate] = useState(null); // Nouvel état pour la date

  // Fonction pour le bouton "Check"
  const onClickCheck = (reservation) => {
    const reservationTime = parseInt(
      reservation.timeResa.replace(/:/g, ""),
      10
    );
    setSelectedReservationDate(reservation.dateResa); // Stocker la date de la réservation

    if (reservationTime <= 150000) {
      setIsModalMidiOpen(true); // Ouvrir la modale Midi
    } else {
      setIsModalSoirOpen(true); // Ouvrir la modale Soir
    }
  };

  // Fonctions pour fermer les modales
  const handleCloseMidiModal = () => {
    setIsModalMidiOpen(false);
    setSelectedReservationDate(null); // Réinitialiser la date
  };

  const handleCloseSoirModal = () => {
    setIsModalSoirOpen(false);
    setSelectedReservationDate(null); // Réinitialiser la date
  };

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

  const handleBackClick = () => {
    setShowConfirmationOptions(null);
  };

  const handleConfirmClick = (reservation) => {
    setShowConfirmationOptions(reservation.id);
  };

  const handleFinalConfirmation = async (id, isSms = false) => {
    try {
      setIsConfirming(true);
      await validateReservation({ id, isSms }).unwrap();
      setShowConfirmationOptions(null);
      setIsConfirming(false);
    } catch (error) {
      console.error("Failed to update reservation status:", error);
      setIsConfirming(false);
    }
  };

  const handleConfirmationSMS = async (id, isSms = true) => {
    try {
      setIsConfirming(true);
      await validateReservation({ id, isSms }).unwrap();
      setShowConfirmationOptions(null);
      setIsConfirming(false);
    } catch (error) {
      console.error("Failed to update reservation status:", error);
      setIsConfirming(false);
    }
  };

  const handleRejectClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsConfirmationAnnulationModalOpen(true);
  };

  const confirmRejectReservation = async () => {
    try {
      setIsSubmitting(true);
      setIsConfirming(true);
      await refuseReservation({
        id: selectedReservation.id,
        user: "current_user",
      }).unwrap();
      setIsConfirmationAnnulationModalOpen(false);
      setShowConfirmationOptions(null);
      refetchReservations();
    } catch (error) {
      console.error("Failed to refuse reservation:", error);
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
      setIsConfirming(false);
    }
  };

  const openRequestProcessingModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const closeRequestProcessingModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  return (
    <div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
          Réservations & Modifications
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
                    {reservation.status === "P" ? (
                      showConfirmationOptions === reservation.id ? (
                        <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-x-1 md:justify-end">
                          {isConfirming ? (
                            <button className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
                              En cours...
                            </button>
                          ) : (
                            <>
                              <button
                                className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFinalConfirmation(reservation.id);
                                }}
                              >
                                Par Email
                              </button>
                              <button
                                className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmationSMS(reservation.id);
                                }}
                              >
                                Par Email et SMS
                              </button>
                              <button
                                className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBackClick();
                                }}
                              >
                                Retour
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-x-1 md:justify-end">
                          <button
                            className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-blue-400 text-white hover:bg-green-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClickCheck(reservation); // Appeler la fonction ici
                            }}
                          >
                            Check
                          </button>
                          <button
                            className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmClick(reservation);
                            }}
                          >
                            Confirmer
                          </button>
                          <button
                            className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectClick(reservation);
                            }}
                          >
                            Refuser
                          </button>
                        </div>
                      )
                    ) : reservation.status === "M" ? (
                      <div className="flex justify-center md:justify-end">
                        <button
                          className="px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-orange-50 text-orange-700 hover:bg-orange-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            openRequestProcessingModal(reservation);
                          }}
                        >
                          Traiter la demande
                        </button>
                      </div>
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
        refetchReservation={refetchReservations}
      />
      <RequestProcessingModal
        reservation={selectedReservation}
        isOpen={isModalOpen}
        onClose={closeRequestProcessingModal}
      />
      <ConfirmationAnnulerModal
        isOpen={isConfirmationModalOpen}
        onConfirm={confirmRejectReservation}
        onClose={() => setIsConfirmationAnnulationModalOpen(false)}
        message="Êtes-vous sûr de vouloir refuser la réservation ?"
        isSubmitting={isSubmitting}
      />

      {/* Rendu conditionnel des modales */}
      {isModalMidiOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={handleCloseMidiModal}
            >
              X
            </button>
            <ModalViewPlanMidi
              date={selectedReservationDate} // Utiliser la date de la réservation sélectionnée
              period="midi"
              onClose={handleCloseMidiModal}
            />
          </div>
        </div>
      )}

      {isModalSoirOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={handleCloseSoirModal}
            >
              X
            </button>
            <ModalViewPlan
              date={selectedReservationDate} // Utiliser la date de la réservation sélectionnée
              period="soir"
              onClose={handleCloseSoirModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
