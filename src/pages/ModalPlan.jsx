import React, { useEffect, useState } from "react";
import { useGetAllocationsQuery } from "../services/allocationsApi";

const ModalPlan = ({ reservation, closeModal }) => {
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

  useEffect(() => {
    if (allocations) {
      console.log("Allocations:", allocations);
      const occupied = allocations.map((allocation) => allocation.table.name);
      setOccupiedTables(occupied);
    }
  }, [allocations]);

  const handleTableClick = (table) => {
    // Vérifie d'abord si la table est occupée
    if (isOccupied(table)) {
      // Si la table est occupée, ne fais rien
      return;
    }

    // Ensuite, gère la logique de sélection comme avant
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
  const isOccupied = (table) => occupiedTables.includes(table);

  const handleMultiTableToggle = () => setIsMultiTableMode(!isMultiTableMode);

  const getTableClass = (table) => {
    return `table border-4 shadow-lg px-10 py-10 ${
      isSelected(table)
        ? "bg-blue-300"
        : isOccupied(table)
        ? "bg-green-300"
        : "border-gray-500"
    }`;
  };

  return (
    <div className="w-full px-10 mb-14 z-50">
      <div className="pt-10 flex justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isMultiTableMode}
            onChange={handleMultiTableToggle}
          />
          <span>Mode Multi-Table</span>
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Confirmer les Tables Sélectionnées ({selectedTables.length})
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start gap-5">
            {["7", "8"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
          <div className="flex flex-row w-3/4 justify-end gap-5">
            {["9", "10", "11", "12", "13", "14"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start">
            {["6"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end">
            {["15"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/3 justify-between">
            {["5", "20"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end gap-5">
            {["19", "18", "16"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/4 justify-start">
            {["4"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
          <div className="flex flex-row w-2/3 justify-end">
            {["17"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-2/3 justify-between gap-5">
            {["3", "22", "23", "24", "25", "26"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
          <div className="flex flex-row w-1/3 justify-between gap-5">
            {["2", "2-BIS", "1-BIS", "1"].map((table) => (
              <div
                key={table}
                id={table}
                className={getTableClass(table, 98)}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPlan;
