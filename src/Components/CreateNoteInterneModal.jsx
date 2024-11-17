import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAddNoteInterneMutation } from "../services/reservations";

const CreateNoteInterneModal = ({ reservation, onClose }) => {
  // Ensure hooks are at the top level
  const [noteContent, setNoteContent] = useState("");
  const [addNoteInterne, { isLoading }] = useAddNoteInterneMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef(null);

  // Event listener to handle clicks outside the modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Check if reservation is null or undefined
  if (!reservation) {
    return null; // Or render a loading state
  }

  // Format the date
  const formatDate = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}`);
    return format(date, "EEEE dd MMMM yyyy, HH:mm", { locale: fr });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!noteContent.trim()) {
      setErrorMessage("La note ne peut pas être vide.");
      return;
    }

    try {
      await addNoteInterne({
        ResaId: reservation.id,
        Note: noteContent,
        CreatedBy: "ADMIN", // Replace with actual user
      }).unwrap();
      setErrorMessage("");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note :", error);
      setErrorMessage("Une erreur s'est produite lors de l'ajout de la note.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 modal-overlay">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-xl relative max-w-lg w-full overflow-auto"
      >
        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Ajouter une note interne pour la réservation :{" "}
          {reservation.client?.prenom || "Prénom inconnu"}{" "}
          {reservation.client?.name || "Nom inconnu"}
        </h2>

        {/* Reservation Details */}
        <p className="text-sm text-gray-600 mb-2">
          <strong>Date de la réservation :</strong>{" "}
          {formatDate(reservation.dateResa, reservation.timeResa)}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Nombre de personnes :</strong> {reservation.numberOfGuest}
        </p>
        {reservation.freeTable21 === "O" && (
          <p className="text-sm text-green-600 font-semibold mb-2">
            Libération de table prévue à 21h.
          </p>
        )}
        {reservation.freeTable1330 === "O" && (
          <p className="text-sm text-green-600 font-semibold mb-2">
            Libération de table prévue à 13h30.
          </p>
        )}

        {/* Textarea for internal note */}
        <div className="mt-4">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Note interne :
          </label>
          <textarea
            id="note"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          {errorMessage && (
            <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 transition duration-200"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-200"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "En cours..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteInterneModal;
