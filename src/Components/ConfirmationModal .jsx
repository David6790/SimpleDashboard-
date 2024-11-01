import React, { useState } from "react";

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsModalSubmitting(true);
    await onConfirm();
    setIsModalSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
        <div className="bg-yellow-500 text-white px-4 py-2">
          <h2 className="text-lg font-semibold">Information importante</h2>
        </div>
        <div className="p-4">
          <p>{message}</p>
        </div>
        <div className="p-4 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            disabled={isModalSubmitting}
          >
            Je refuse, annule ma réservation
          </button>
          <button
            onClick={handleConfirm}
            className={`text-white px-4 py-2 rounded transition-colors ${
              isModalSubmitting
                ? "bg-yellow-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={isModalSubmitting}
          >
            {isModalSubmitting
              ? "En cours..."
              : "J'accepte de libérer la table"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
