import React from "react";

const ReservationDetailModal = ({ reservation, onClose, onMove }) => {
  if (!reservation) return null;

  const freeTable21Style =
    reservation.freeTable21 === "O" ? "bg-yellow-300" : "bg-red-300";

  const handleMoveClick = () => {
    if (onMove && reservation.reservationId) {
      onMove(reservation.reservationId); // Renvoie uniquement le reservationId
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg relative max-h-[95%] max-w-[95%] overflow-auto m-4"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur le contenu
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
        </div>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Fermer
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleMoveClick} // Appel de la fonction pour activer le mode édition avec le reservationId
          >
            Déplacer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
