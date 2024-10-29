import React from "react";

const ConfirmationModalStaff = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

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
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalStaff;
