import React from "react";

const ReservationDetailModal = ({ reservation, onClose }) => {
  if (!reservation) return null;

  const freeTable21Text =
    reservation.freeTable21 === "O" ? (
      <span className="bg-yellow-300 p-1 rounded">OUI</span>
    ) : (
      <span className="bg-red-300 p-1 rounded">NON</span>
    );

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg relative max-h-[95%] max-w-[95%] overflow-auto m-4"
        onClick={(e) => e.stopPropagation()} // Stop the propagation
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
          <p>
            <strong>Libre à 21h:</strong> {freeTable21Text}
          </p>
          <p>
            <strong>Commentaire:</strong> {reservation.comment || "Aucun"}
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
