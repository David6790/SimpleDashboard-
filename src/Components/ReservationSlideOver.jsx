import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useCancelNoShowReservationMutation } from "../services/reservations";
import { getStatusText } from "../Outils/conversionTextStatus";
import ModalNotesInternes from "./ModalNotesInternes";
import { useAddNoteInterneMutation } from "../services/reservations";
import allocationsApi from "../services/allocationsApi";

function formatTimestamp(dateString) {
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
}

function ReservationSlideOver({
  isOpen,
  onClose,
  reservation,
  refreshReservations,
}) {
  const [showConfirmationButtons, setShowConfirmationButtons] = useState(false); // Nouvel état pour les boutons de confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false); // État pour afficher/cacher le formulaire de note
  const [noteContent, setNoteContent] = useState(""); // Contenu de la note à ajouter

  const navigate = useNavigate();
  const [cancelReservation] = useCancelNoShowReservationMutation();
  const user = useSelector((state) => state.user.username);

  const [addNoteInterne, { isLoading: isAddingNoteLoading }] =
    useAddNoteInterneMutation();

  const handleEditReservation = () => {
    navigate("/reservation-update", { state: { reservation } });
  };

  const handleEditPowerReservation = () => {
    navigate("/power-update", { state: { reservation } });
  };

  const handleOpenConfirmationButtons = () => {
    setShowConfirmationButtons(true);
  };

  const handleCloseConfirmationButtons = () => {
    setShowConfirmationButtons(false);
  };

  const dispatch = useDispatch();
  const period =
    reservation && reservation.timeResa < "15:00:00" ? "midi" : "soir";
  const date = reservation && reservation.dateResa;
  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      alert("La note ne peut pas être vide.");
      return;
    }
    try {
      await addNoteInterne({
        ResaId: reservation.id,
        Note: noteContent,
        CreatedBy: user || "Anonyme",
      }).unwrap();

      setIsAddingNote(false); // Fermer la zone de texte après succès
      setNoteContent("");
      dispatch(
        allocationsApi.endpoints.getAllocations.initiate(
          { date, period },
          { forceRefetch: true }
        )
      );
      // Réinitialiser le contenu

      // Rafraîchir les données de la réservation
      if (refreshReservations) {
        refreshReservations();
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note :", error);
      alert("Une erreur est survenue lors de l'ajout de la note.");
    }
  };

  const confirmCancelResa = async () => {
    setIsSubmitting(true);
    try {
      await cancelReservation({ id: reservation.id, user: user }).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleGir = () => {
    navigate(`/gir-staff/${reservation.id}`);
  };

  const isAdmin = useSelector((state) => state.user);

  // Vérification que la réservation et timeResa existent
  const isMidi = reservation?.timeResa && reservation.timeResa < "15:00:00";
  const occupationStatus = isMidi
    ? reservation?.occupationStatusMidiOnBook
    : reservation?.occupationStatusSoirOnBook;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl rounded-l-lg">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                          Détails de la réservation
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Fermer le panneau</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6 space-y-4">
                      {reservation ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-md font-medium text-indigo-600">
                              Client
                            </h3>
                            <p className="text-sm text-gray-700">
                              <strong>Nom:</strong> {reservation.client.name}{" "}
                              {reservation.client.prenom}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Téléphone:</strong>{" "}
                              {reservation.client.telephone}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Email:</strong> {reservation.client.email}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-md font-medium text-indigo-600">
                              Réservation
                            </h3>
                            <p className="text-sm text-gray-700">
                              <strong>Date de réservation:</strong>{" "}
                              {new Date(
                                reservation.dateResa
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Heure:</strong> {reservation.timeResa}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Nombre de couverts:</strong>{" "}
                              {reservation.numberOfGuest}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Commentaire:</strong>{" "}
                              {reservation.comment || "N/A"}
                            </p>
                            <div>
                              <h3 className="text-sm text-gray-700 mt-1">
                                <strong>Notes internes:</strong>
                              </h3>

                              {/* Si des notes existent, afficher le bouton "Voir" avec blink */}
                              {reservation.notesInternes?.length > 0 ? (
                                ""
                              ) : (
                                <p className="text-sm text-gray-700">
                                  Pas de notes actuellement.
                                </p>
                              )}

                              {/* Bouton pour ajouter une note */}
                              <div className="mt-4">
                                <button
                                  onClick={() =>
                                    setIsAddingNote((prev) => !prev)
                                  }
                                  className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition duration-200"
                                >
                                  {isAddingNote
                                    ? "Annuler"
                                    : "Ajouter une note"}
                                </button>
                              </div>

                              {/* Formulaire d'ajout de note */}
                              {isAddingNote && (
                                <div className="mt-4">
                                  <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    rows="4"
                                    value={noteContent}
                                    onChange={(e) =>
                                      setNoteContent(e.target.value)
                                    }
                                  />
                                  <button
                                    onClick={handleAddNote}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    disabled={isAddingNoteLoading}
                                  >
                                    {isAddingNoteLoading
                                      ? "Ajout en cours..."
                                      : "Confirmer"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-md font-medium text-indigo-600">
                              Statut
                            </h3>
                            <p className="text-sm text-gray-700">
                              <strong>Status:</strong>{" "}
                              {getStatusText(reservation.status)}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Placée:</strong>{" "}
                              {reservation.placed === "N" ? "NON" : "OUI"}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-md font-medium text-indigo-600">
                              Informations supplémentaires
                            </h3>
                            <p className="text-sm text-gray-700">
                              <strong>Créée le:</strong>{" "}
                              {formatTimestamp(reservation.creaTimeStamp)}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Modifiée le:</strong>{" "}
                              {reservation.updateTimeStamp === null
                                ? "Pas de modification"
                                : formatTimestamp(reservation.updateTimeStamp)}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Créé par:</strong> {reservation.createdBy}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Modifié par:</strong>{" "}
                              {reservation.updatedBy || "N/A"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Annulé par:</strong>{" "}
                              {reservation.canceledBy || "N/A"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Annulé le:</strong>{" "}
                              {reservation.canceledTimeStamp === null
                                ? ""
                                : formatTimestamp(
                                    reservation.canceledTimeStamp
                                  )}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-md font-medium text-indigo-600">
                              a Détails techniques
                            </h3>
                            <p className="text-sm text-gray-700">
                              <strong>ID de la réservation:</strong>{" "}
                              {reservation.id}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Occupation Status:</strong>{" "}
                              {occupationStatus}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Free Table 21:</strong>{" "}
                              {reservation.freeTable21 === "O" ? "Oui" : "Non"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Free Table 13:30:</strong>{" "}
                              {reservation.freeTable1330 === "O"
                                ? "Oui"
                                : "Non"}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Power User:</strong>{" "}
                              {reservation.isPowerUser === "O" ? "Oui" : "Non"}
                            </p>
                          </div>

                          {reservation.status === "A" ||
                          reservation.status === "R" ? (
                            <button
                              onClick={handleGir}
                              className="w-full bg-indigo-600 text-white rounded-md py-2 text-center font-semibold hover:bg-indigo-700"
                            >
                              Ouvrir la GIR
                            </button>
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-lg shadow flex flex-col gap-5">
                              {reservation.status !== "M" && (
                                <button
                                  onClick={handleEditReservation}
                                  className="w-full bg-indigo-600 text-white rounded-md py-2 text-center font-semibold hover:bg-indigo-700"
                                >
                                  Modifier la réservation
                                </button>
                              )}

                              <button
                                onClick={handleGir}
                                className="w-full bg-indigo-600 text-white rounded-md py-2 text-center font-semibold hover:bg-indigo-700"
                              >
                                Ouvrir la GIR
                              </button>
                              {isAdmin.role === "ADMIN" ||
                              isAdmin.role === "USER" ||
                              isAdmin.role === "MANAGER" ? (
                                <div className="bg-gray-50 p-4 rounded-lg shadow flex flex-col gap-5">
                                  {showConfirmationButtons ? (
                                    // Afficher les boutons de confirmation
                                    <>
                                      <button
                                        onClick={confirmCancelResa}
                                        className="w-full bg-red-600 text-white rounded-md py-2 text-center font-semibold hover:bg-red-700"
                                        disabled={isSubmitting} // Désactive le bouton pendant l'envoi
                                      >
                                        {isSubmitting
                                          ? "En cours..."
                                          : "Confirmer annulation"}
                                      </button>

                                      <button
                                        onClick={handleCloseConfirmationButtons}
                                        className="w-full bg-gray-300 text-gray-700 rounded-md py-2 text-center font-semibold hover:bg-gray-400"
                                      >
                                        Retour
                                      </button>
                                    </>
                                  ) : (
                                    // Afficher le bouton pour ouvrir la confirmation
                                    <button
                                      onClick={handleOpenConfirmationButtons}
                                      className="w-full bg-indigo-600 text-white rounded-md py-2 text-center font-semibold hover:bg-indigo-700"
                                    >
                                      Annuler la réservation
                                    </button>
                                  )}
                                  {isAdmin.role === "ADMIN" && (
                                    <button
                                      onClick={handleEditPowerReservation}
                                      className="w-full bg-indigo-600 text-white rounded-md py-2 text-center font-semibold hover:bg-indigo-700"
                                    >
                                      POWER MOD
                                    </button>
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>Chargement des détails...</div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          {/* ModalNotesInternes */}
          {isNotesModalOpen && (
            <ModalNotesInternes
              reservation={reservation} // Passer la prop réservation
              refetchData={refreshReservations}
              onClose={() => setIsNotesModalOpen(false)} // Fermer le modal
            />
          )}
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ReservationSlideOver;
