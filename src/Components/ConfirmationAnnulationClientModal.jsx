export default function ConfirmationAnnulationClientModal({
  isOpen,
  onConfirm,
  onClose,
  message,
  isSubmitting,
  cancelReason, // Transmis par le parent
  setCancelReason, // Transmis par le parent
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(); // Appelle directement la fonction de confirmation sans passer de raison locale
  };

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
          Confirmation
        </h2>
        <p className="text-gray-600 mb-6 text-center">{message}</p>

        {/* Zone de texte pour saisir la raison */}
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Si vous acceptez de nous donner la raison de l'annulation, écrivez-la ici."
          value={cancelReason} // Utilise la valeur depuis les props
          onChange={(e) => setCancelReason(e.target.value)} // Met à jour via les props
        ></textarea>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
            disabled={isSubmitting} // Désactiver pendant la soumission
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 font-semibold rounded-lg transition ${
              isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            disabled={isSubmitting} // Désactiver pendant la soumission
          >
            {isSubmitting ? "En cours..." : "OUI, annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}
