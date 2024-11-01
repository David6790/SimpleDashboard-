import React, { useEffect, useState } from "react";
import {
  useGetModificationRequestByOriginalReservationIdQuery,
  useValidateModificationMutation,
  useRefuseModificationMutation,
  useCancelModificationMutation,
} from "../services/reservations";
import { useGetNotificationToggleQuery } from "../services/toggleApi";

export default function RequestProcessingModal({
  reservation,
  isOpen,
  onClose,
}) {
  const {
    data: modificationRequest,
    error,
    isLoading,
  } = useGetModificationRequestByOriginalReservationIdQuery(
    reservation ? reservation.id : null
  );

  const { refetch: refetchToggle } = useGetNotificationToggleQuery();

  const [validateModification] = useValidateModificationMutation();
  const [refuseModification] = useRefuseModificationMutation();
  const [cancelModification] = useCancelModificationMutation();
  const [showAlternativeButtons, setShowAlternativeButtons] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Nouvel état pour le traitement en cours

  useEffect(() => {
    if (modificationRequest) {
      console.log(
        "Donnée retournée de la réservation modifiée:",
        modificationRequest
      );
    }
  }, [modificationRequest]);

  if (!isOpen || !reservation) return null;

  const handleClose = () => {
    setShowAlternativeButtons(false);
    onClose();
  };

  const handleConfirmModification = async () => {
    try {
      setIsProcessing(true); // Activer l'état de traitement
      await validateModification(reservation.id).unwrap();
      handleClose();
      refetchToggle();
    } catch (error) {
      console.error("Erreur lors de la validation de la modification:", error);
    } finally {
      setIsProcessing(false); // Désactiver l'état de traitement
    }
  };

  const handleRefuseModification = async () => {
    try {
      setIsProcessing(true); // Activer l'état de traitement
      await refuseModification(reservation.id).unwrap();
      handleClose();
      refetchToggle();
    } catch (error) {
      console.error("Erreur lors du refus de la modification:", error);
    } finally {
      setIsProcessing(false); // Désactiver l'état de traitement
    }
  };

  const handleCancelModification = async () => {
    try {
      setIsProcessing(true); // Activer l'état de traitement
      await cancelModification(reservation.id).unwrap();
      handleClose();
      refetchToggle();
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
    } finally {
      setIsProcessing(false); // Désactiver l'état de traitement
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto z-10 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Réservation de {reservation.client.name} {reservation.client.prenom}
        </h2>

        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Réservation actuelle
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Date :</strong>{" "}
              <span className="text-gray-800">
                {new Date(reservation.dateResa).toLocaleDateString()}
              </span>
            </p>
            <p className="text-gray-600">
              <strong>Heure :</strong>{" "}
              <span className="text-gray-800">{reservation.timeResa}</span>
            </p>
            <p className="text-gray-600">
              <strong>Nombre de personnes :</strong>{" "}
              <span className="text-gray-800">{reservation.numberOfGuest}</span>
            </p>
            <p className="text-gray-600">
              <strong>Consigne de libération :</strong>{" "}
              {reservation.freeTable1330 === "O" ? (
                <span className="bg-yellow-100 text-yellow-900 font-semibold px-2 py-1 rounded">
                  Le client libère la table à 13h30
                </span>
              ) : reservation.freeTable21 === "O" ? (
                <span className="bg-yellow-100 text-yellow-900 font-semibold px-2 py-1 rounded">
                  Le client libère la table à 21h
                </span>
              ) : (
                <span className="text-gray-500">Aucune consigne</span>
              )}
            </p>
          </div>
        </div>

        {modificationRequest && (
          <div className="border border-gray-300 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Demande de modification
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Date :</strong>{" "}
                <span className="text-gray-800">
                  {new Date(modificationRequest.dateResa).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Heure :</strong>{" "}
                <span className="text-gray-800">
                  {modificationRequest.timeResa}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Nombre de personnes :</strong>{" "}
                <span className="text-gray-800">
                  {modificationRequest.numberOfGuest}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Consigne de libération :</strong>{" "}
                {modificationRequest.freeTable1330 === "O" ? (
                  <span className="bg-yellow-100 text-yellow-900 font-semibold px-2 py-1 rounded">
                    Le client libère la table à 13h30
                  </span>
                ) : modificationRequest.freeTable21 === "O" ? (
                  <span className="bg-yellow-100 text-yellow-900 font-semibold px-2 py-1 rounded">
                    Le client libère la table à 21h
                  </span>
                ) : (
                  <span className="text-gray-500">Aucune consigne</span>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          {showAlternativeButtons ? (
            <>
              <button
                onClick={handleRefuseModification}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "En cours..."
                  : "Conserver la réservation initiale"}
              </button>
              <button
                onClick={handleCancelModification}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                disabled={isProcessing}
              >
                {isProcessing ? "En cours..." : "Annuler la réservation"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleConfirmModification}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                disabled={isProcessing}
              >
                {isProcessing ? "En cours..." : "Confirmer"}
              </button>
              <button
                onClick={() => setShowAlternativeButtons(true)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                disabled={isProcessing}
              >
                Refuser
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
