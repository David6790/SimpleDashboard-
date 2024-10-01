import React, { useEffect, useState } from "react";
import {
  useGetAllocationsQuery,
  useCreateAllocationMutation,
} from "../services/allocationsApi";
import ErrorModal from "../Components/ErrorModal";

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

const ModalPlan = ({ reservation, closeModal, refreshReservations }) => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const date = reservation ? reservation.dateResa : null;
  const periode = reservation
    ? new Date(`1970-01-01T${reservation.timeResa}`) <
      new Date(`1970-01-01T14:00:00`)
      ? "midi"
      : "soir"
    : null;

  const { data: allocations } = useGetAllocationsQuery({
    date,
    period: periode,
  });

  const [createAllocation, { isLoading }] = useCreateAllocationMutation();

  useEffect(() => {
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
          isAfter21hReservation: allocation.reservation.timeResa >= "21:00:00",
        });
        return acc;
      }, {});
      setOccupiedTables(occupied);
    }
  }, [allocations]);

  const handleTableClick = (table) => {
    const occupiedReservations = occupiedTables[table];

    if (occupiedReservations) {
      const isAvailableAfter21 = occupiedReservations.some(
        (reservation) =>
          reservation.freeTable21 === "O" &&
          new Date(`1970-01-01T${reservation.timeResa}`) <
            new Date(`1970-01-01T21:00:00`)
      );

      const isAfter21hReservation = occupiedReservations.some(
        (reservation) => reservation.isAfter21hReservation
      );

      if (!isAvailableAfter21 && !isAfter21hReservation && isOccupied(table)) {
        return;
      }

      if (
        reservation.timeResa >= "21:00:00" &&
        !isAfter21hReservation &&
        !isAvailableAfter21
      ) {
        return;
      }

      if (
        reservation.timeResa < "21:00:00" &&
        isAfter21hReservation &&
        !reservation.freeTable21
      ) {
        return;
      }
    }

    setSelectedTables((prevSelectedTables) =>
      prevSelectedTables.includes(table)
        ? prevSelectedTables.filter((t) => t !== table)
        : [...prevSelectedTables, table]
    );
  };

  const isSelected = (table) => selectedTables.includes(table);

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

    return `table border-2 shadow-md flex flex-col justify-between text-xs h-12 rounded-md ${
      isSelected(table)
        ? "bg-blue-300"
        : isPartiallyAvailable
        ? "bg-yellow-300"
        : isOccupied(table)
        ? "bg-yellow-300"
        : "border-gray-500"
    }`;
  };

  const getOccupiedTableInfo = (table) => {
    const occupiedReservations = occupiedTables[table];

    if (occupiedReservations && occupiedReservations.length > 0) {
      return (
        <>
          {/* Première réservation avec style normal */}
          <div className="flex-1 flex items-center justify-center text-xs bg-yellow-300 p-1 rounded-t">
            <div>{`${occupiedReservations[0].clientPrenom} ${occupiedReservations[0].clientNom} ${occupiedReservations[0].numberOfGuest}p ${occupiedReservations[0].timeResa}`}</div>
          </div>
          {occupiedReservations.length > 1 && (
            <div className="border-t border-white mt-1 flex-1 flex items-center justify-center text-xs bg-orange-400 p-1 rounded-b">
              {/* Deuxième réservation avec style plus foncé */}
              {`${occupiedReservations[1].clientPrenom} ${occupiedReservations[1].clientNom} ${occupiedReservations[1].numberOfGuest}p ${occupiedReservations[1].timeResa}`}
            </div>
          )}
          <div className="mt-auto mb-0 text-center w-full">
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
        <div className="text-xs text-white font-bold bg-blue-600 rounded-md py-0.5 px-1 inline-block">
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
        <div className="text-xs text-white font-bold bg-green-600 rounded-md py-0.5 px-1 inline-block">
          Libre à 21h
        </div>
      );
    }
    return null;
  };

  const handleConfirmTables = async () => {
    setErrorMessage("");
    const tableIds = selectedTables.map((table) => tableIdMapping[table]);

    const newAllocation = {
      reservationId: reservation.id,
      date: date,
      period: periode,
      tableId: tableIds,
    };

    try {
      await createAllocation(newAllocation).unwrap();

      if (refreshReservations) {
        refreshReservations();
      }

      closeModal();
    } catch (error) {
      console.error("Failed to create allocation:", error);
      setErrorMessage(error.data?.error || "Failed to create allocation");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="w-full px-8 mb-12 z-50">
      <div className="pt-8 flex justify-between mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleConfirmTables}
          disabled={isLoading}
        >
          {isLoading
            ? "Creating..."
            : `Confirmer les Tables Sélectionnées (${selectedTables.length})`}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="pt-8 flex flex-row justify-between ">
          <div className="flex flex-row w-1/4 justify-start gap-2">
            {["7", "8"].map((table) => (
              <div
                key={table}
                className="relative flex flex-col justify-between items-center"
              >
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-3/4 justify-end gap-2">
            {["9", "11", "12", "13", "14"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start">
            {["6"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end">
            {["15"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/3 justify-between">
            {["5", "20"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end gap-2">
            {["19", "18", "16"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start">
            {["4"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end">
            {["17"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-2/3 justify-between gap-2">
            {["3", "22", "23", "24", "25", "26"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/3 justify-between gap-2">
            {["2", "2-BIS", "1-BIS", "1"].map((table) => (
              <div key={table} className="relative flex flex-col items-center">
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {getOccupiedTableInfo(table)}
                </div>
                <div className="text-xs mt-0.5">{table}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        errorMessage={errorMessage}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};

export default ModalPlan;
