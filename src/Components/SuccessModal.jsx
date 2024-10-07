import React from "react";

const SuccessModal = ({ isOpen, successMessage, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
        <div className="bg-green-500 text-white px-4 py-2">
          <h2 className="text-lg font-semibold">Succès</h2>
        </div>
        <div className="p-4">
          <p>{successMessage}</p>
        </div>
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
