import React, { useEffect, useState } from "react";
import {
  useGetAllocationsQuery,
  useCreateAllocationMutation,
} from "../services/allocationsApi";

// Mapping table names to their IDs
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
  21: 22,
  22: 23,
  23: 24,
  24: 25,
  25: 26,
  26: 27,
};

const ModalPlan = ({ reservation, closeModal, refreshReservations }) => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [isMultiTableMode, setIsMultiTableMode] = useState(false);
  const [occupiedTables, setOccupiedTables] = useState([]);

  const date = reservation ? reservation.dateResa : null;
  const periode = reservation
    ? new Date(`1970-01-01T${reservation.timeResa}`) <
      new Date(`1970-01-01T14:00:00`)
      ? "midi"
      : "soir"
    : null;

  const {
    data: allocations,
    //isLoading,
    //error,
  } = useGetAllocationsQuery({
    date,
    period: periode,
  });

  const [createAllocation, { isLoading, isError, isSuccess }] =
    useCreateAllocationMutation();

  useEffect(() => {
    if (allocations) {
      console.log("Allocations:", allocations);
      const occupied = allocations.map((allocation) => ({
        tableName: allocation.table.name,
        clientPrenom: allocation.reservation.clientPrenom,
        timeResa: allocation.reservation.timeResa,
        numberOfGuest: allocation.reservation.numberOfGuest,
      }));
      setOccupiedTables(occupied);
    }
  }, [allocations]);

  const handleTableClick = (table) => {
    console.log("Table clicked:", table, "ID:", tableIdMapping[table]);

    if (isOccupied(table)) {
      return;
    }
    if (isMultiTableMode) {
      setSelectedTables((prevSelectedTables) =>
        prevSelectedTables.includes(table)
          ? prevSelectedTables.filter((t) => t !== table)
          : [...prevSelectedTables, table]
      );
    } else {
      setSelectedTables((prevSelectedTables) =>
        prevSelectedTables.includes(table) ? [] : [table]
      );
    }
  };

  const isSelected = (table) => selectedTables.includes(table);
  const isOccupied = (table) =>
    occupiedTables.some((occupied) => occupied.tableName === table);

  const getTableClass = (table) => {
    return `table border-4 shadow-lg  flex items-end justify-center text-md ${
      isSelected(table)
        ? "bg-blue-300"
        : isOccupied(table)
        ? "bg-green-300"
        : "border-gray-500"
    }`;
  };

  const getOccupiedTableInfo = (table) => {
    const occupiedTable = occupiedTables.find(
      (occupied) => occupied.tableName === table
    );
    if (occupiedTable) {
      return `${occupiedTable.clientPrenom}, ${occupiedTable.timeResa}, ${occupiedTable.numberOfGuest}p`;
    }
    return null;
  };

  const handleMultiTableToggle = () => setIsMultiTableMode(!isMultiTableMode);

  const handleConfirmTables = async () => {
    const tableIds = selectedTables.map((table) => tableIdMapping[table]);

    const newAllocation = {
      reservationId: reservation.id, // Assuming reservation has an id property
      date: date,
      period: periode,
      tableId: tableIds,
    };

    try {
      console.log(newAllocation);
      await createAllocation(newAllocation).unwrap();

      // Rafraîchir les réservations après la création de l'allocation
      if (refreshReservations) {
        refreshReservations();
      }

      closeModal(); // Assuming you want to close the modal after creation
    } catch (error) {
      console.error("Failed to create allocation:", error);
      alert("Failed to create allocation");
    }
  };

  return (
    <div className="w-full px-10 mb-14 z-50 ">
      <div className="pt-10 flex justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isMultiTableMode}
            onChange={handleMultiTableToggle}
          />
          <span>Mode Multi-Table</span>
        </label>
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
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start gap-5">
            {["7", "8"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-3/4 justify-end gap-5">
            {["9", "11", "12", "13", "14"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start">
            {["6"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end">
            {["15"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/3 justify-between">
            {["5", "20"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end gap-5">
            {["19", "18", "16"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start">
            {["4"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end">
            {["17"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-2/3 justify-between gap-5">
            {["3", "22", "23", "24", "25", "26"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/3 justify-between gap-5">
            {["2", "2-BIS", "1-BIS", "1"].map((table) => (
              <div key={table} className="relative">
                {isOccupied(table) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                    {getOccupiedTableInfo(table)}
                  </div>
                )}
                <div
                  id={table}
                  className={getTableClass(table)}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPlan;
