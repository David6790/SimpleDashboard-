import React, { useEffect, useState } from "react";
import { useGetAllocationsQuery } from "../services/allocationsApi";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

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
          isAfter21hReservation: allocation.reservation.timeResa >= "21:00:00", // Ajout du drapeau isAfter21hReservation ici
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
          reservation.isAfter21hReservation // Considérer les réservations après 21h comme partiellement disponibles
      );

    return `table border-4 shadow-lg flex flex-col justify-between text-sm h-20 ${
      isPartiallyAvailable
        ? "bg-yellow-300"
        : isOccupied(table)
        ? "bg-green-300"
        : "border-gray-500"
    }`;
  };

  const getOccupiedTableInfo = (table) => {
    const occupiedReservations = occupiedTables[table];

    if (occupiedReservations && occupiedReservations.length > 0) {
      return (
        <>
          <div className="flex-1 flex items-center justify-center text-xs border-b border-gray-400">
            {`${occupiedReservations[0].clientPrenom} ${occupiedReservations[0].clientNom} ${occupiedReservations[0].numberOfGuest}p ${occupiedReservations[0].timeResa}`}
          </div>
          {occupiedReservations.length > 1 && (
            <div className="flex-1 flex items-center justify-center text-xs">
              {`${occupiedReservations[1].clientPrenom} ${occupiedReservations[1].clientNom} ${occupiedReservations[1].numberOfGuest}p ${occupiedReservations[1].timeResa}`}
            </div>
          )}
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
        <div className="text-xs font-bold bg-blue-300 p-1 rounded-t mb-1">
          Dispo pour 19h
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
        <div className="text-xs font-bold bg-yellow-300 p-1 rounded-t mb-1">
          Libre à 21h
        </div>
      );
    }
    return null;
  };

  const handleClickOutside = (event) => {
    if (event.target.className.includes("modal-overlay")) {
      onClose();
    }
  };

  const formattedDate = format(new Date(date), "EEEE dd MMMM yyyy", {
    locale: fr,
  });

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded-md shadow-lg relative max-h-[95%] max-w-[95%] overflow-auto m-4">
        <div className="text-xl font-semibold text-center mb-4">
          {formattedDate} - {period === "midi" ? "Midi" : "Soir"}
        </div>

        <div className="w-full h-full overflow-auto px-4">
          <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
            <div className="flex flex-row w-1/4 justify-start gap-5">
              {["7", "8"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
                >
                  {getFreeTable21Info(table)}
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
