import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "./Pagination";
import ReservationSlideOver from "./ReservationSlideOver";

import ModalViewPlan from "../pages/ModalViewPlan";
import ModalViewPlanMidi from "../pages/ModalViewPlanMidi";
import { getStatusStyles } from "../Outils/statusStyle";
import { getStatusText } from "../Outils/conversionTextStatus";
import { useDeleteAllocationsByReservationMutation } from "../services/allocationsApi";
import { reservationsApi } from "../services/reservations";
import { useDispatch } from "react-redux";

export default function PreviewTableDashboard({
  reservations,
  isError,
  error,
  refreshReservations,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPeriod, setModalPeriod] = useState(""); // Pour gérer le type de modal (midi ou soir)
  const [confirmRemove, setConfirmRemove] = useState(null);

  const [deleteAllocation, { isLoading: isDeleting }] =
    useDeleteAllocationsByReservationMutation();

  const dispatch = useDispatch();

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations
    ? reservations.slice(indexOfFirstItem, indexOfLastItem)
    : null;
  const totalItems = reservations ? reservations.length : 0;

  const openSlideOver = (reservation) => {
    setSelectedReservation(reservation);
    setIsSlideOverOpen(true);
  };

  const closeSlideOver = () => {
    setIsSlideOverOpen(false);
    setTimeout(() => {
      setSelectedReservation(null);
    }, 0); // Retarde la réinitialisation de selectedReservation à null
  };

  const handlePlaceTableClick = (reservation, e) => {
    e.stopPropagation();
    const reservationTime = parseInt(
      reservation.timeResa.replace(/:/g, ""),
      10
    );

    if (reservation.placed === "N") {
      setSelectedReservation(reservation);

      // Ouvrir le bon modal en fonction de l'heure de la réservation
      if (reservationTime < 150000) {
        // Si l'heure est avant 15:00, ouvrir le plan Midi
        setModalPeriod("midi");
      } else {
        // Si l'heure est après 15:00, ouvrir le plan Soir
        setModalPeriod("soir");
      }
      setIsModalOpen(true); // Ouvrir le modal
    } else {
      setConfirmRemove(reservation.id);
    }
  };

  const handleConfirmRemove = async (reservation, e) => {
    e.stopPropagation();
    try {
      await deleteAllocation(reservation.id).unwrap();
      refreshReservations();
      dispatch(reservationsApi.util.invalidateTags(["Reservations"])); // Refresh the reservations after deletion
      setConfirmRemove(null);
    } catch (error) {
      console.error("Failed to delete allocation:", error);
    }
  };

  const handleCancelRemove = (e) => {
    e.stopPropagation();
    setConfirmRemove(null);
  };

  return (
    <div className="-mx-4 mt-8 sm:-mx-0">
      {isError && (
        <div className="text-center text-red-500">
          Une erreur s'est produite lors de la récupération des réservations :{" "}
          {error?.data || "Erreur inconnue"}
        </div>
      )}
      {!isError && currentItems && currentItems.length === 0 && (
        <div className="text-center text-gray-500">
          Pas de réservations pour cette date.
        </div>
      )}
      {currentItems && currentItems.length > 0 && (
        <>
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Nom
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Heure
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Couverts
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Téléphone
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Placée
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentItems.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                  onClick={() => openSlideOver(reservation)}
                >
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {reservation.client.name + " " + reservation.client.prenom}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Date</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {new Date(reservation.dateResa).toLocaleDateString()}
                      </dd>
                      <dt className="sr-only">Heure</dt>
                      <dd className="mt-1 truncate text-gray-500">
                        {reservation.timeResa.slice(0, -3)}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {new Date(reservation.dateResa).toLocaleDateString()}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {reservation.timeResa}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {reservation.numberOfGuest}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {reservation.client.telephone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <button
                      className={`px-2 py-1 rounded ${getStatusStyles(
                        reservation.status
                      )}`}
                    >
                      {getStatusText(reservation.status)}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {reservation.placed === "N" ? (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        NON
                      </span>
                    ) : reservation.placed === "O" ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        OUI
                      </span>
                    ) : null}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    {reservation.status !== "A" &&
                      reservation.status !== "R" &&
                      reservation.status !== "P" &&
                      reservation.status !== "D" &&
                      // Ne pas afficher le bouton si le statut est "P"
                      (confirmRemove === reservation.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                            onClick={(e) => handleConfirmRemove(reservation, e)}
                            disabled={isDeleting} // Disable button while deleting
                          >
                            {isDeleting ? "Suppression..." : "Confirmer"}
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                            onClick={handleCancelRemove}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            reservation.placed === "N"
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                          onClick={(e) => handlePlaceTableClick(reservation, e)}
                        >
                          {reservation.placed === "N"
                            ? "Placer la table"
                            : "Retirer du plan"}
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      <ReservationSlideOver
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        reservation={selectedReservation}
      />

      {selectedReservation && isModalOpen && modalPeriod === "midi" && (
        <ModalViewPlanMidi
          date={selectedReservation.dateResa} // Utilisez la date du state
          period="midi"
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {selectedReservation && isModalOpen && modalPeriod === "soir" && (
        <ModalViewPlan
          date={selectedReservation.dateResa} // Utilisez la date du state
          period="soir"
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
