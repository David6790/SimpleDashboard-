import React from "react";

export default function SucessConfirmationModalCreation({
  isOpen,
  reservationDetails,
  onClose,
}) {
  if (!isOpen || !reservationDetails) return null;
  console.log(reservationDetails);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg p-8 w-full max-w-lg mx-auto z-10 shadow-2xl transition-all duration-300 transform scale-95">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            Enregistrement Réussi !
          </h2>
          <p className="text-gray-700 mb-6">
            Votre réservation a été enregistrée avec succès et est actuellement
            en attente de validation. Veuillez vérifier votre boîte mail pour
            recevoir la confirmation. N'hésitez pas à nous ajouter à vos favoris
            afin que nos emails ne se retrouvent pas dans vos spams.
          </p>
          <div className="border-t border-gray-200 mt-4 pt-4">
            <ul className="text-left text-gray-600 space-y-2">
              <li>
                <span className="font-medium text-gray-800">Date :</span>{" "}
                {reservationDetails.dateResa}
              </li>
              <li>
                <span className="font-medium text-gray-800">Heure :</span>{" "}
                {reservationDetails.timeResa}
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Nombre de personnes :
                </span>{" "}
                {reservationDetails.numberOfGuest}
              </li>
              <li>
                <span className="font-medium text-gray-800">Nom :</span>{" "}
                {reservationDetails.client.name}
              </li>
              <li>
                <span className="font-medium text-gray-800">Prénom :</span>{" "}
                {reservationDetails.client.prenom}
              </li>
              <li>
                <span className="font-medium text-gray-800">Téléphone :</span>{" "}
                {reservationDetails.client.telephone}
              </li>
              <li>
                <span className="font-medium text-gray-800">Email :</span>{" "}
                {reservationDetails.client.email}
              </li>
              <li>
                <span className="font-medium text-gray-800">Commentaire :</span>{" "}
                {reservationDetails.comment}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            OK, fermer
          </button>
        </div>
      </div>
    </div>
  );
}
