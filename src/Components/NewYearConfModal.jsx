import React, { useState } from "react";
import NewYearMenuImageModal from "./NewYearMenuImageModal"; // Assurez-vous que le chemin est correct

const NewYearConfModal = ({ isOpen, onClose, onConfirm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-40"></div>

      {/* Contenu du modal */}
      <div className="relative z-50 w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-yellow-50 via-white to-yellow-50 px-8 py-8 overflow-y-auto max-h-[80vh]">
          {/* Titre */}
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
            🎉 MENU NOUVEL AN 2024 🎉
          </h2>

          {/* Introduction Nouvel An */}
          <div className="space-y-4 text-sm text-gray-900 mb-8 leading-6">
            <p className="text-center">
              Pour célébrer le réveillon, nous vous proposons un menu festif à{" "}
              <strong className="font-semibold text-gray-700">
                59€ par personne
              </strong>
              . Notez que, ce soir-là, la carte habituelle ne sera pas
              disponible. ✨
            </p>
            <p className="text-center">
              Une fois votre réservation effectuée, vous recevrez un lien par
              email pour accéder à votre espace personnel. Sur cet espace, vous
              pourrez régler un{" "}
              <strong className="font-semibold text-gray-700">
                acompte de 20€ par couvert
              </strong>
              . Votre réservation sera confirmée dès que cet acompte sera réglé.
              🥂
            </p>
            <p className="text-center">
              Après ce dîner, vous serez libres de poursuivre vos festivités où
              bon vous semble ! Notre restaurant fermera ses portes avant
              minuit, mais ne partez pas sans demander quelques conseils à notre
              équipe — de vrais fêtards, ils se feront un plaisir de vous
              suggérer les meilleurs endroits pour célébrer la nouvelle année
              jusqu’au bout de la nuit !
            </p>
          </div>

          {/* Bouton Voir le menu */}
          <div className="text-center mb-10">
            <button
              onClick={() => {
                setIsMenuOpen(true);
              }}
              className="rounded-full bg-yellow-300 px-4 py-2 text-md font-semibold text-gray-800 hover:bg-yellow-400 focus:outline-none shadow-md transition-colors duration-200"
            >
              Voir le menu ✨
            </button>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={onClose}
              className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none shadow transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 focus:outline-none shadow transition-colors duration-200"
            >
              Réserver Nouvel An 🥂
            </button>
          </div>
        </div>
      </div>

      {/* Modal pour l'image du menu */}
      <NewYearMenuImageModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default NewYearConfModal;
