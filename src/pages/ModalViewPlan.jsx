import React, { useEffect, useState } from "react";
import {
  useGetAllocationsQuery,
  useChangeAllocationMutation,
} from "../services/allocationsApi";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import ReservationDetailModal from "../Components/ReservationDetailModal";
import ErrorModal from "../Components/ErrorModal"; // Import du modal d'erreur

const tableIdMapping = {
  1: 1,
  "1-BIS": 2,
  "2-BIS": 3,
  2: 4,
  3: 5,
  4: 6,
  5: 7,
  6: 8,
  7: 9,
  8: 10,
  9: 11,
  11: 12,
  12: 13,
  13: 14,
  14: 15,
  15: 16,
  16: 17,
  17: 18,
  18: 19,
  19: 20,
  20: 21,
  22: 22,
  23: 23,
  24: 24,
  25: 25,
  26: 26,
};

const ModalViewPlan = ({ date, period, onClose }) => {
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedResId, setselectedResId] = useState(null);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // État pour le modal d'erreur
  const [errorMessage, setErrorMessage] = useState(""); // État pour le message d'erreur

  const { data: allocations } = useGetAllocationsQuery({
    date,
    period,
  });

  const [changeAllocation, { isLoading }] = useChangeAllocationMutation();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    if (allocations) {
      const occupied = allocations.reduce((acc, allocation) => {
        const tableName = allocation.table.name;
        if (!acc[tableName]) {
          acc[tableName] = [];
        }
        acc[tableName].push({
          clientPrenom: allocation.reservation.clientPrenom,
          clientNom: allocation.reservation.clientName,
          timeResa: allocation.reservation.timeResa,
          numberOfGuest: allocation.reservation.numberOfGuest,
          freeTable21: allocation.reservation.freeTable21,
          comment: allocation.reservation.comment,
          clienttelephone: allocation.reservation.clientTelephone,
          isAfter21hReservation: allocation.reservation.timeResa >= "21:00:00",
          tableId: allocation.table.id,
          reservationId: allocation.reservationId,
        });
        return acc;
      }, {});
      setOccupiedTables(occupied);
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [allocations]);

  const isOccupied = (table) =>
    occupiedTables[table] && occupiedTables[table].length > 0;

  const getTableClass = (table) => {
    const isPartiallyAvailable =
      isOccupied(table) &&
      occupiedTables[table].some(
        (reservation) =>
          (reservation.freeTable21 === "O" &&
            new Date(`1970-01-01T${reservation.timeResa}`) <
              new Date(`1970-01-01T21:00:00`)) ||
          reservation.isAfter21hReservation
      );

    return `table border-4 shadow-lg flex flex-col justify-between text-sm h-20 rounded-md ${
      isSelected(table)
        ? "bg-blue-500 text-white"
        : isPartiallyAvailable
        ? "bg-yellow-400"
        : isOccupied(table)
        ? "bg-yellow-400"
        : "border-gray-300 bg-white hover:shadow-md hover:border-gray-400 transition duration-200 ease-in-out"
    }`;
  };

  const isSelected = (table) => selectedTables.includes(table);

  const handleTableClick = (table) => {
    if (isEditing) {
      setSelectedTables((prevSelectedTables) =>
        prevSelectedTables.includes(table)
          ? prevSelectedTables.filter((t) => t !== table)
          : [...prevSelectedTables, table]
      );
    }
  };

  const handleMove = (resId) => {
    setIsEditing(true);
    setIsReservationModalOpen(false);
    setselectedResId(resId);
  };

  const handleConfirmMove = async () => {
    const selectedTableIds = selectedTables.map(
      (table) => tableIdMapping[table]
    );

    try {
      await changeAllocation({
        reservationId: selectedResId,
        newTableIds: selectedTableIds,
        date: date,
        period: period,
      }).unwrap();

      setIsEditing(false);
      setSelectedTables([]);
      setSelectedReservation(null);
    } catch (error) {
      setErrorMessage(
        error.data?.error || "Erreur lors du déplacement de l'allocation."
      );
      setIsErrorModalOpen(true); // Ouvre le modal d'erreur
    }
  };

  const getOccupiedTableInfo = (table) => {
    const occupiedReservations = occupiedTables[table];

    if (occupiedReservations && occupiedReservations.length > 0) {
      return (
        <>
          <div
            className="flex-1 flex items-center justify-center text-xs cursor-pointer"
            onClick={() => {
              if (!isEditing) {
                setSelectedReservation(occupiedReservations[0]);
                setIsReservationModalOpen(true);
              }
            }}
          >
            {`${occupiedReservations[0].clientPrenom} ${occupiedReservations[0].clientNom} ${occupiedReservations[0].numberOfGuest}p ${occupiedReservations[0].timeResa}`}
          </div>
          {occupiedReservations.length > 1 && (
            <div
              className="flex-1 flex items-center justify-center text-xs border-t border-white  cursor-pointer"
              onClick={() => {
                if (!isEditing) {
                  setSelectedReservation(occupiedReservations[1]);
                  setIsReservationModalOpen(true);
                }
              }}
            >
              {`${occupiedReservations[1].clientPrenom} ${occupiedReservations[1].clientNom} ${occupiedReservations[1].numberOfGuest}p ${occupiedReservations[1].timeResa}`}
            </div>
          )}
          <div className="text-center w-full mt-1">
            {getFreeTable21Info(table)}
          </div>
        </>
      );
    }
    return (
      <div className="flex-1 flex items-center justify-center text-xs"></div>
    );
  };

  const getFreeTable21Info = (table) => {
    const occupiedReservations = occupiedTables[table];

    if (
      occupiedReservations &&
      occupiedReservations.some(
        (reservation) =>
          reservation.isAfter21hReservation && occupiedReservations.length === 1
      )
    ) {
      return (
        <div className="text-xs text-white font-bold bg-blue-600 rounded-md py-0.5 px-2 inline-block">
          Dispo 19h
        </div>
      );
    }

    if (
      occupiedReservations &&
      occupiedReservations.some(
        (reservation, index) =>
          reservation.freeTable21 === "O" &&
          index === 0 &&
          occupiedReservations.length === 1
      )
    ) {
      return (
        <div className="text-xs text-white font-bold bg-green-600 rounded-md py-0.5 px-2 inline-block">
          Libre à 21h
        </div>
      );
    }
    return null;
  };

  const handleClickOutside = (event) => {
    if (event.target.className.includes("modal-overlay") && !isEditing) {
      onClose();
    }
  };

  const formattedDate = format(new Date(date), "EEEE dd MMMM yyyy", {
    locale: fr,
  });

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
      onClick={handleClickOutside}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-xl relative max-h-[95%] max-w-[95%] overflow-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing ? (
          <div className="text-2xl font-bold text-center mb-6 text-gray-700">
            Mode Edition Activée
          </div>
        ) : (
          <div className="text-2xl font-bold text-center mb-6 text-gray-700">
            {formattedDate} - {period === "midi" ? "Midi" : "Soir"}
          </div>
        )}

        {isEditing && (
          <div className="text-center text-sm text-gray-600 mb-4">
            Sélectionnez la ou les tables vers lesquelles vous souhaitez
            déplacer la réservation.
          </div>
        )}

        {isEditing && (
          <div className="flex justify-between mb-6">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>

            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
              onClick={handleConfirmMove}
              disabled={isLoading}
            >
              {isLoading ? "Déplacement..." : "Confirmer la sélection"}
            </button>
          </div>
        )}

        <div className="w-full h-full overflow-auto px-4">
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-1/4 justify-start gap-5">
              {["7", "8"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-row w-3/4 justify-end gap-5">
              {["9", "11", "12", "13", "14"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-1/4 justify-start">
              {["6"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-row w-2/3 justify-end">
              {["15"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-1/3 justify-between">
              {["5", "20"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-row w-2/3 justify-end gap-5">
              {["19", "18", "16"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-1/4 justify-start">
              {["4"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-row w-2/3 justify-end">
              {["17"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-2/3 justify-between gap-5">
              {["3", "22", "23", "24", "25", "26"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-1/3 justify-between gap-5">
              {["2", "2-BIS", "1-BIS", "1"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-sm mt-1">{table}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-200"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>

        {/* Reservation Details Modal */}
        {isReservationModalOpen && (
          <ReservationDetailModal
            reservation={selectedReservation}
            onClose={() => setIsReservationModalOpen(false)}
            onMove={handleMove}
          />
        )}

        {/* Error Modal */}
        <ErrorModal
          isOpen={isErrorModalOpen}
          errorMessage={errorMessage}
          onClose={() => setIsErrorModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ModalViewPlan;
