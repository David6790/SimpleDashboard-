import React from "react";

const ErrorModal = ({ isOpen, errorMessage, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
        <div className="bg-red-500 text-white px-4 py-2">
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <div className="p-4">
          <p>{errorMessage}</p>
        </div>
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
