import React, { useState } from "react";
import {
  useDeleteAllocationsByReservationMutation,
  useGetAllocationsQuery,
} from "../services/allocationsApi";
import {
  useSetHasArrivedMutation,
  useSetDepartClientMutation,
  useLastMinuteChangeMutation,
  reservationsApi,
} from "../services/reservations";
import { useDispatch } from "react-redux";
import ErrorModal from "./ErrorModal";

import ModalNotesInternesBis from "./ModalNotesInternesBis";
// Import du modal des notes internes

const ReservationDetailModal = ({
  reservation,
  onClose,
  onMove,
  date,
  period,
}) => {
  const [deleteAllocation] = useDeleteAllocationsByReservationMutation();
  const [setHasArrived] = useSetHasArrivedMutation();
  const [setDepartClient] = useSetDepartClientMutation();
  const [lastMinuteChange, { isLoading: isLastMinuteChangeLoading }] =
    useLastMinuteChangeMutation();
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false); // État pour ouvrir/fermer le modal des notes internes
  const [isLastMinuteChangeMode, setIsLastMinuteChangeMode] = useState(false);
  const [newGuestCount, setNewGuestCount] = useState("");
  const [inputError, setInputError] = useState("");

  const { data: allocations, refetch: refetchAllocations } =
    useGetAllocationsQuery({
      date,
      period,
    });

  if (!reservation) return null;

  console.log(reservation);

  const freeTable21Style =
    reservation.freeTable21 === "O" ? "bg-yellow-300" : "bg-red-300";

  // Méthodes définies en dehors du JSX

  const handleMoveClick = () => {
    if (onMove && reservation.reservationId) {
      onMove(reservation.reservationId);
    }
  };

  const handleDeleteAllocation = async () => {
    try {
      await deleteAllocation(reservation.reservationId).unwrap();
      onClose();
      dispatch(reservationsApi.util.invalidateTags(["Reservations"]));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'allocation:", error);
    }
  };

  const handleArrivalStatusChange = async () => {
    try {
      await setHasArrived({
        id: reservation.reservationId,
        hasArrived: !reservation.hasArrived,
      }).unwrap();
      await refetchAllocations();
      onClose();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut d'arrivée:",
        error
      );
    }
  };

  const handleDepartClient = async () => {
    try {
      await setDepartClient(reservation.reservationId).unwrap();
      onClose();
      await refetchAllocations();
    } catch (error) {
      setErrorMessage(error.data?.message || "Une erreur est survenue.");
      setIsErrorModalOpen(true);
    }
  };

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const closeErrorModal = () => setIsErrorModalOpen(false);

  const handleLastMinuteChangeClick = () => {
    setIsLastMinuteChangeMode(true);
  };

  const handleLastMinuteChangeCancel = () => {
    setIsLastMinuteChangeMode(false);
    setInputError("");
    setNewGuestCount("");
  };

  const handleLastMinuteChangeSubmit = async () => {
    if (!newGuestCount || isNaN(newGuestCount) || Number(newGuestCount) <= 0) {
      setInputError("Veuillez entrer un nombre entier positif.");
      return;
    }
    try {
      await lastMinuteChange({
        id: reservation.reservationId,
        newGuestCount: newGuestCount,
      }).unwrap();
      await refetchAllocations();
      onClose();
    } catch (error) {
      setInputError(error.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg relative max-h-[95%] max-w-[95%] overflow-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          Détails de la réservation
        </h2>
        <div className="text-sm">
          <p>
            <strong>Prénom:</strong> {reservation.clientPrenom}
          </p>
          <p>
            <strong>Nom:</strong> {reservation.clientNom}
          </p>
          <p>
            <strong>Numéro de téléphone:</strong> {reservation.clienttelephone}
          </p>
          <p>
            <strong>Heure de réservation:</strong> {reservation.timeResa}
          </p>
          <p>
            <strong>Nombre de personnes:</strong> {reservation.numberOfGuest}
          </p>
          <p className={`${freeTable21Style} p-2 rounded`}>
            <strong>Libre à 21h:</strong>{" "}
            <span className={freeTable21Style}>
              {reservation.freeTable21 === "O" ? "Oui" : "Non"}
            </span>
          </p>
          <p>
            <strong>Commentaire:</strong> {reservation.comment || "Aucun"}
          </p>
          {reservation.isSpecialEvent === true ? (
            <p>
              <strong>Acompte:</strong> {reservation.deposit + "€"}
            </p>
          ) : (
            ""
          )}
          {reservation.notesInternes?.length > 0 && (
            <p className=" mt-5 mb-5">
              <strong>Note interne:</strong>{" "}
              <button
                onClick={() => setIsNotesModalOpen(true)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200 blink"
              >
                Lire Notes Internes
              </button>
            </p>
          )}
        </div>

        {!isLastMinuteChangeMode ? (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Fermer
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={handleMoveClick}
            >
              Déplacer
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDeleteAllocation}
            >
              Retirer du plan
            </button>
            <button
              className={`${
                !reservation.hasArrived ? "bg-green-500" : "bg-gray-500"
              } text-white px-4 py-2 rounded`}
              onClick={handleArrivalStatusChange}
            >
              {reservation.hasArrived
                ? "Oups, me suis trompé"
                : "Marquer arrivé"}
            </button>
            {reservation.hasArrived && (
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded"
                onClick={openConfirmModal}
              >
                Départ Client
              </button>
            )}
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded"
              onClick={handleLastMinuteChangeClick}
            >
              Last Minute Changes
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <label className="block mb-2">
              Nouveau nombre de personnes:
              <input
                type="number"
                className="border rounded w-full py-2 px-3 mt-1"
                value={newGuestCount}
                onChange={(e) => setNewGuestCount(e.target.value)}
              />
            </label>
            {inputError && <p className="text-red-500 text-sm">{inputError}</p>}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleLastMinuteChangeCancel}
              >
                Annuler
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleLastMinuteChangeSubmit}
                disabled={isLastMinuteChangeLoading}
              >
                {isLastMinuteChangeLoading ? "EN COURS..." : "Soumettre"}
              </button>
            </div>
          </div>
        )}

        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg max-w-sm w-full m-4">
              <h3 className="text-lg font-semibold mb-4">
                Confirmation du départ
              </h3>
              <p>
                Êtes-vous sûr de vouloir marquer la réservation comme libérée ?
                Les clients ont bien quitté la table ? Cette action est
                irréversible.
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={closeConfirmModal}
                >
                  Non
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    handleDepartClient();
                    closeConfirmModal();
                  }}
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal des notes internes */}
      {isNotesModalOpen && (
        <ModalNotesInternesBis
          reservation={reservation}
          onClose={() => setIsNotesModalOpen(false)}
        />
      )}

      <ErrorModal
        isOpen={isErrorModalOpen}
        errorMessage={errorMessage}
        onClose={closeErrorModal}
      />
    </div>
  );
};

export default ReservationDetailModal;
