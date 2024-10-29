import React from "react";

export default function SuccessConfirmationModal({
  isOpen,
  reservationDetails,
  onClose,
}) {
  if (!isOpen || !reservationDetails) return null;
  console.log(reservationDetails);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto z-10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Modification réussie !
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          Votre réservation a été mise à jour avec succès.
        </p>
        <ul className="list-none list-inside space-y-2">
          <li>
            <strong>Date :</strong> {reservationDetails.dateResa}
          </li>
          <li>
            <strong>Heure :</strong> {reservationDetails.timeResa}
          </li>
          <li>
            <strong>Nombre de personnes :</strong>{" "}
            {reservationDetails.numberOfGuest}
          </li>
          <li>
            <strong>Nom :</strong> {reservationDetails.client.prenom}
          </li>
          <li>
            <strong>Prénom :</strong> {reservationDetails.client.name}
          </li>
          <li>
            <strong>Téléphone :</strong> {reservationDetails.client.telephone}
          </li>
          <li>
            <strong>Email :</strong> {reservationDetails.client.email}
          </li>
          <li>
            <strong>Commentaire :</strong> {reservationDetails.comment}
          </li>
        </ul>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            OK, fermer
          </button>
        </div>
      </div>
    </div>
  );
}
