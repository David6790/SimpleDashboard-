import React, { useEffect, useState } from "react";
import { useGetAllocationsQuery } from "../services/allocationsApi";
import { format } from "date-fns";
import fr from "date-fns/locale/fr"; // Importez ceci pour formater en français

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

const ModalViewPlan = ({ date, period, onClose }) => {
  const [occupiedTables, setOccupiedTables] = useState([]);

  const { data: allocations } = useGetAllocationsQuery({
    date,
    period,
  });

  useEffect(() => {
    document.body.classList.add("no-scroll");
    if (allocations) {
      const occupied = allocations.map((allocation) => ({
        tableName: allocation.table.name,
        clientPrenom: allocation.reservation.clientPrenom,
        timeResa: allocation.reservation.timeResa,
        numberOfGuest: allocation.reservation.numberOfGuest,
      }));
      setOccupiedTables(occupied);
    }
    return () => {
      // Retirer la classe no-scroll du body lorsqu'on démonte le composant (le modal se ferme)
      document.body.classList.remove("no-scroll");
    };
  }, [allocations]);

  const isOccupied = (table) =>
    occupiedTables.some((occupied) => occupied.tableName === table);

  const getTableClass = (table) => {
    return `table border-4 shadow-lg flex items-end justify-center text-md ${
      isOccupied(table) ? "bg-green-300" : "border-gray-500"
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

  const handleClickOutside = (event) => {
    if (event.target.className.includes("modal-overlay")) {
      onClose();
    }
  };

  // Formater la date
  const formattedDate = format(new Date(date), "EEEE dd MMMM yyyy", {
    locale: fr,
  });

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded-md shadow-lg relative max-h-[95%] max-w-[95%] overflow-auto m-4">
        {/* Titre avec la date formatée et la période */}
        <div className="text-xl font-semibold text-center mb-4">
          {formattedDate} - {period === "midi" ? "Midi" : "Soir"}
        </div>

        <div className="w-full h-full overflow-auto px-4">
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-1/4 justify-start gap-5">
              {["7", "8"].map((table) => (
                <div key={table} className="relative">
                  {isOccupied(table) && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-4 py-2 rounded-full shadow-lg text-xs font-bold">
                      {getOccupiedTableInfo(table)}
                    </div>
                  )}
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
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
                  <div id={table} className={getTableClass(table)}>
                    {table}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton Fermer */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewPlan;
