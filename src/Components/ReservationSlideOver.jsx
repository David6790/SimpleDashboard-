import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ReservationSlideOver({ isOpen, onClose, reservation }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
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
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {reservation && (
                        <div>
                          <p className="mb-2">
                            <strong>Nom:</strong> {reservation.client.name}{" "}
                            {reservation.client.prenom}
                          </p>
                          <p className="mb-2">
                            <strong>Téléphone:</strong>{" "}
                            {reservation.client.telephone}
                          </p>
                          <p className="mb-2">
                            <strong>Email:</strong> {reservation.client.email}
                          </p>
                          <p className="mb-2">
                            <strong>Date:</strong>{" "}
                            {new Date(
                              reservation.dateResa
                            ).toLocaleDateString()}
                          </p>
                          <p className="mb-2">
                            <strong>Heure:</strong> {reservation.timeResa}
                          </p>
                          <p className="mb-2">
                            <strong>Nombre de couverts:</strong>{" "}
                            {reservation.numberOfGuest}
                          </p>
                          <p className="mb-2">
                            <strong>Commentaire:</strong>{" "}
                            {reservation.comment || "N/A"}
                          </p>
                          <p className="mb-2">
                            <strong>Status:</strong>{" "}
                            {reservation.status === "P" ? "Pending" : "Validée"}
                          </p>
                          <p className="mb-2">
                            <strong>Placée:</strong>{" "}
                            {reservation.placed === "N" ? "NON" : "OUI"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 sm:px-6 py-3 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onClose}
                      >
                        Fermer
                      </button>
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
