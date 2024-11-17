import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useDeleteNoteInterneMutation } from "../services/reservations";

const ModalNotesInternesBis = ({ reservation, onClose, refetchData }) => {
  const [deleteNoteInterne] = useDeleteNoteInterneMutation();
  const [noteToDelete, setNoteToDelete] = useState(null); // État pour suivre la suppression

  // Formater la date de réservation
  const formatDate = (timeString) => {
    const now = new Date();
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...timeString.split(":").map(Number)
    );
    return format(date, "EEEE dd MMMM yyyy, HH:mm", { locale: fr });
  };

  // Formater le timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "EEEE dd MMMM yyyy, HH:mm", { locale: fr });
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNoteInterne(noteId).unwrap();
      setNoteToDelete(null); // Réinitialiser l'état
      await refetchData(); // Rafraîchir les données
      onClose();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la note interne :",
        error
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl relative max-w-lg w-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titre du modal */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Notes internes Réservation : {reservation.clientPrenom}{" "}
          {reservation.clientNom}
        </h2>

        {/* Détails de la réservation */}
        <p className="text-sm text-gray-600 mb-2">
          <strong>Date de la réservation :</strong>{" "}
          {formatDate(reservation.timeResa)}
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

        {/* Notes internes */}
        {reservation.notesInternes?.length > 0 ? (
          <div className="space-y-4">
            {reservation.notesInternes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-gray-100 rounded-md shadow-sm border-l-4 border-blue-500"
              >
                <p className="text-sm text-gray-800">{note.note}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Créé par : {note.createdBy || "Non spécifié"} -{" "}
                  {formatTimestamp(note.createdAt)}
                </p>

                {/* Bouton Supprimer */}
                <div className="mt-2">
                  {noteToDelete === note.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Confirmer Suppression
                      </button>
                      <button
                        onClick={() => setNoteToDelete(null)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setNoteToDelete(note.id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Aucune note interne disponible.
          </p>
        )}

        {/* Bouton de fermeture */}
        <div className="mt-4 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-200"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNotesInternesBis;
