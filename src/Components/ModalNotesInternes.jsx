import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSelector } from "react-redux";
import { useDeleteNoteInterneMutation } from "../services/reservations";

const ModalNotesInternes = ({ reservation, onClose, refetchData }) => {
  const [deleteNoteInterne] = useDeleteNoteInterneMutation();
  const [noteToDelete, setNoteToDelete] = useState(null); // ID de la note en cours de suppression

  // Formater la date de réservation
  const formatDate = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}`);
    return format(date, "EEEE dd MMMM yyyy, HH:mm", { locale: fr });
  };

  // Formater le timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "EEEE dd MMMM yyyy, HH:mm", { locale: fr });
  };

  const user = useSelector((state) => state.user.role);

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNoteInterne(noteId).unwrap();
      setNoteToDelete(null); // Réinitialiser l'état
      onClose(); // Fermer le modal
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
          Notes internes Réservation : {reservation.client.prenom}{" "}
          {reservation.client.name}
        </h2>

        {/* Détails de la réservation */}
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

        {/* Affichage des notes internes */}
        {reservation.notesInternes?.length > 0 ? (
          <div className="space-y-4">
            {reservation.notesInternes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-gray-100 rounded-md shadow-sm border-l-4 border-blue-500"
              >
                <p className="text-sm text-gray-800">{note.note}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Créé par : {note.createdBy || "Inconnu"} -{" "}
                  {formatTimestamp(note.createdAt)}
                </p>

                {/* Bouton Supprimer visible uniquement pour ADMIN */}
                {(user === "ADMIN" || user === "Admin") && (
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
                )}
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

export default ModalNotesInternes;
