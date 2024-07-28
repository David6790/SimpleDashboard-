import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCancelReservationMutation } from "../services/reservations";

function formatTimestamp(dateString) {
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
}

function ReservationSlideOver({ isOpen, onClose, reservation }) {
  const navigate = useNavigate();

  const [cancelReservation] = useCancelReservationMutation();

  const handleEditReservation = () => {
    navigate("/reservation-update", { state: { reservation } });
  };

  const cancelResa = async (id) => {
    try {
      await cancelReservation(id).unwrap();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const isAdmin = useSelector((state) => state.user);
  console.log(isAdmin.role);
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
                      {reservation && (
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
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-md font-medium text-indigo-600">
                              Statut
                            </h3>
                            <p className="text-sm text-gray-700">
                              <strong>Status:</strong>{" "}
                              {reservation.status === "P"
                                ? "Pending"
                                : "Validée"}
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
                              {reservation.updateTimeStamp ===
                              reservation.creaTimeStamp
                                ? "Pas de modification"
                                : formatTimestamp(reservation.updateTimeStamp)}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Créé par:</strong> {reservation.createdBy}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Modifié par:</strong>{" "}
                              {reservation.updatedBy}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-md font-medium text-indigo-600">
                              Détails techniques
                            </h3>
                            <p className="text-sm text-gray-700">
                              <strong>Occupation Status on Book:</strong>{" "}
                              {reservation.occupationStatusOnBook}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Free Table 21:</strong>{" "}
                              {reservation.freeTable21}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Power User:</strong>{" "}
                              {reservation.isPowerUser}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow flex flex-col gap-10">
                            <button
                              onClick={handleEditReservation}
                              className="w-full bg-indigo-600 text-white rounded-md py-2 text-center font-semibold hover:bg-indigo-700"
                            >
                              Modifier la réservation
                            </button>
                            {isAdmin.role === "ADMIN" ? (
                              <button
                                className="w-full bg-indigo-600 text-white rounded-md py-2 text-center font-semibold hover:bg-indigo-700"
                                onClick={() => cancelResa(reservation.id)}
                              >
                                Annuler la réservation
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ReservationSlideOver;
