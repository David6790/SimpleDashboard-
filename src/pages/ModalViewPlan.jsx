import React, { useEffect, useState } from "react";
import {
  useGetAllocationsQuery,
  useChangeAllocationMutation,
  useCreateAllocationMutation,
} from "../services/allocationsApi";
import {
  useGetReservationsByDateAndPeriodQuery,
  useCreateSpontaneousReservationMutation,
} from "../services/reservations";
import { format, isSameDay } from "date-fns";
import fr from "date-fns/locale/fr";
import ReservationDetailModal from "../Components/ReservationDetailModal";
import ErrorModal from "../Components/ErrorModal"; // Import du modal d'erreur
import { useDispatch } from "react-redux";
import { reservationsApi } from "../services/reservations";
import jsPDF from "jspdf";

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
  "3-BIS": 27,
};

const ModalViewPlan = ({ date, period, onClose }) => {
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedResId, setselectedResId] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // Nouveau mode création
  const [selectedReservationId, setSelectedReservationId] = useState(null); // Ajoute cet état

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // État pour le modal d'erreur
  const [errorMessage, setErrorMessage] = useState(""); // État pour le message d'erreur
  const dispatch = useDispatch();

  const downloadPDF = () => {
    const planElement = document.getElementById("plan-de-salle");

    if (planElement) {
      // Utilisation de jsPDF pour une page unique
      const pdf = new jsPDF("landscape", "pt", "a4"); // Format paysage, page A4

      pdf.html(planElement, {
        callback: function (pdf) {
          pdf.save("plan-de-salle.pdf");
        },
        x: 10, // Positionnement du contenu dans le PDF
        y: 10,
        html2canvas: {
          scale: 0.5, // Réduction de l’échelle pour compacter le contenu sur une page
          useCORS: true,
          scrollY: -window.scrollY, // Corrige les scrolls si nécessaire
        },
        width: 800, // Largeur fixée, ajustée à la taille de la page A4
      });
    }
  };

  const [createSpontaneousReservation] =
    useCreateSpontaneousReservationMutation();

  const { data: allocations } = useGetAllocationsQuery({
    date,
    period,
  });

  console.log(date);

  const {
    data: reservations,
    refetch: refetchReservations, // Ajoute la méthode refetch
  } = useGetReservationsByDateAndPeriodQuery({
    date,
    period,
  });

  console.log(reservations);
  const [changeAllocation, { isLoading }] = useChangeAllocationMutation();
  const [createAllocation, { isLoading: isCreatingLoading }] =
    useCreateAllocationMutation();

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
          hasArrived: allocation.reservation.hasArrived, // Ajout de hasArrived ici
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
    const tableReservations = occupiedTables[table];

    // Vérifiez si au moins une réservation de la table a `hasArrived` à true
    const isArrived =
      tableReservations &&
      tableReservations.some((reservation) => reservation.hasArrived);

    // Vérifiez si la table a une réservation après 21h
    const isAfter21h =
      isOccupied(table) &&
      tableReservations.some(
        (reservation) =>
          new Date(`1970-01-01T${reservation.timeResa}`) >=
          new Date(`1970-01-01T21:00:00`)
      );

    // Vérifiez si la table a une réservation avant 19h
    const isBefore19h =
      isOccupied(table) &&
      tableReservations.some(
        (reservation) =>
          new Date(`1970-01-01T${reservation.timeResa}`) <
          new Date(`1970-01-01T19:00:00`)
      );

    return `table border-2 shadow-md flex flex-col justify-between text-xs h-12 rounded-md ${
      isArrived
        ? "bg-green-500 text-white" // Background vert si le client est arrivé
        : isSelected(table)
        ? "bg-blue-500 text-white border-blue-700 border-4" // Bordure bleue si sélectionnée
        : isAfter21h
        ? "bg-orange-500" // Orange pour les réservations après 21h
        : isBefore19h
        ? "bg-yellow-400" // Jaune pour les réservations avant 19h
        : isOccupied(table)
        ? "bg-yellow-400" // Jaune par défaut pour les autres réservations occupées
        : "border-gray-300 bg-white hover:shadow-md hover:border-gray-400 transition duration-200 ease-in-out"
    }`;
  };

  const isSelected = (table) => selectedTables.includes(table);

  const handleTableClick = (table) => {
    if (isEditing || isCreating) {
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

  const handleCreateMode = (reservation) => {
    setIsCreating(true);
    setSelectedReservation(reservation);
    setSelectedReservationId(reservation.id);
  };

  const handleCreateSpontaneousReservation = async () => {
    try {
      const response = await createSpontaneousReservation().unwrap();
      console.log("Réservation de Présentation Spontanée créée:", response);
      refetchReservations(); // Rechargement des réservations pour inclure la nouvelle réservation
    } catch (error) {
      setErrorMessage(
        error.data?.error ||
          "Erreur lors de la création de la réservation de client de passage."
      );
      setIsErrorModalOpen(true);
    }
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
      refetchReservations();
    } catch (error) {
      setErrorMessage(
        error.data?.error || "Erreur lors du déplacement de l'allocation."
      );
      setIsErrorModalOpen(true); // Ouvre le modal d'erreur
    }
  };

  const handleConfirmCreate = async () => {
    const selectedTableIds = selectedTables.map(
      (table) => tableIdMapping[table]
    );

    try {
      await createAllocation({
        reservationId: selectedReservation.id,
        tableId: selectedTableIds, // Correction ici : utiliser "tableId"
        date: date,
        period: period,
      }).unwrap();

      setIsCreating(false);
      setSelectedTables([]);
      setSelectedReservation(null);

      // Invalide le cache des réservations pour forcer un refetch
      dispatch(reservationsApi.util.invalidateTags(["Reservations"]));
    } catch (error) {
      setErrorMessage(
        error.data?.error || "Erreur lors de la création de l'allocation."
      );
      setIsErrorModalOpen(true); // Ouvre le modal d'erreur
    }
  };

  const getOccupiedTableInfo = (table) => {
    const occupiedReservations = occupiedTables[table];

    if (occupiedReservations && occupiedReservations.length > 0) {
      return (
        <>
          {occupiedReservations.map((reservation, index) => {
            // Détermine la couleur de fond en fonction de l'heure de réservation et de `hasArrived`
            let reservationClass = "bg-yellow-400"; // Par défaut jaune pour les réservations avant 19h
            if (reservation.hasArrived) {
              reservationClass = "bg-green-500 text-white"; // Vert si arrivé
            } else if (
              new Date(`1970-01-01T${reservation.timeResa}`) >=
              new Date(`1970-01-01T21:00:00`)
            ) {
              reservationClass = "bg-orange-500"; // Orange si après 21h
            }

            return (
              <div
                key={index}
                className={`flex-1 flex items-center justify-center text-xs cursor-pointer p-1 ${reservationClass} ${
                  index === 0 ? "rounded-t" : "border-t border-white"
                }`}
                onClick={() => {
                  if (!isEditing && !isCreating) {
                    setSelectedReservation(reservation);
                    setIsReservationModalOpen(true);
                  }
                }}
              >
                {`${reservation.clientPrenom} ${reservation.clientNom} ${reservation.numberOfGuest}p ${reservation.timeResa}`}
              </div>
            );
          })}
          <div className="text-center w-full mt-0.5">
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
          (reservation.isAfter21hReservation ||
            reservation.timeResa === "21:00") && // Inclure les réservations à exactement 21h00
          occupiedReservations.length === 1 // Il n'y a qu'une seule réservation pour cette table
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
        className="bg-white p-4 rounded-lg shadow-xl relative max-h-[95%] min-w-[90%] overflow-auto m-2"
        onClick={(e) => e.stopPropagation()}
        id="plan-de-salle"
      >
        {isEditing ? (
          <div className="text-lg font-bold text-center mb-2 text-gray-700">
            Mode Édition Activé
          </div>
        ) : isCreating ? (
          <div className="text-lg font-bold text-center mb-2 text-gray-700">
            Mode Création Activé
          </div>
        ) : (
          <div className="text-lg font-bold text-center mb-2 text-gray-700">
            {formattedDate} - {period === "midi" ? "Midi" : "Soir"}
          </div>
        )}

        {isEditing && (
          <div className="text-center text-xs text-gray-600 mb-1">
            Sélectionnez la ou les tables vers lesquelles vous souhaitez
            déplacer la réservation.
          </div>
        )}

        {isEditing && (
          <div className="flex justify-between mb-2">
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>

            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
              onClick={handleConfirmMove}
              disabled={isLoading}
            >
              {isLoading ? "Déplacement..." : "Confirmer la sélection"}
            </button>
          </div>
        )}
        {isCreating && (
          <div className="flex justify-between mb-2">
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
              onClick={() => setIsCreating(false)}
            >
              Annuler
            </button>

            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
              onClick={handleConfirmCreate}
              disabled={isCreatingLoading}
            >
              {isCreatingLoading
                ? "Création en cours..."
                : "Confirmer la création"}
            </button>
          </div>
        )}

        <div className="w-full border border-gray-300 rounded-lg p-2 mb-4 overflow-auto">
          {reservations?.length === 0 ? (
            ""
          ) : (
            <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1">
              <h1 className="text-base font-semibold text-gray-600 text-left">
                Réservations à placer
              </h1>

              <button
                className="bg-green-500 text-white px-4 py-1 rounded-md shadow-sm hover:bg-green-600 transition duration-200"
                onClick={handleCreateSpontaneousReservation}
              >
                Créer client de passage
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-start">
            {reservations?.length === 0 ? (
              <div className="w-full flex justify-between items-center">
                <div className="text-lg font-bold text-green-600">
                  Toutes les réservations sont placées, bravo !!
                </div>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded-md shadow-sm hover:bg-green-600 transition duration-200"
                  onClick={handleCreateSpontaneousReservation}
                >
                  Créer client de passage
                </button>
              </div>
            ) : (
              reservations?.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`p-1 w-17 rounded-lg shadow-md text-center cursor-pointer border-2 ${
                    reservation.id === selectedReservationId
                      ? "border-blue-500" // Bordure bleue pour la réservation sélectionnée
                      : "border-gray-300" // Bordure grise par défaut
                  } ${
                    reservation.freeTable21 === "O"
                      ? "bg-green-200"
                      : "bg-pink-200"
                  }`}
                  onClick={() => handleCreateMode(reservation)} // Active le mode création et sélectionne la carte
                >
                  <h3 className="text-xs font-bold truncate">
                    {`${reservation.client.prenom} ${reservation.client.name}`}
                  </h3>
                  <p className="text-[10px]">Heure : {reservation.timeResa}</p>
                  <p className="text-[10px]">
                    Pers : {reservation.numberOfGuest}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full h-full  px-2">
          <div className="pt-2 flex flex-row justify-between min-w-[900px]">
            <div className="flex flex-row w-1/4 justify-start gap-2">
              {["7", "8"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-row w-3/4 justify-end gap-2">
              {["9", "11", "12", "13", "14"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 flex flex-row justify-between min-w-[900px]">
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
                  <div className="text-xs mt-0.5">{table}</div>
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
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 flex flex-row justify-between min-w-[900px]">
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
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-row w-2/3 justify-end gap-2">
              {["19", "18", "16"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 flex flex-row justify-between min-w-[900px]">
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
                  <div className="text-xs mt-0.5">{table}</div>
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
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 flex flex-row justify-between min-w-[900px]">
            <div className="flex flex-row w-2/3 justify-between gap-2">
              {["3", "22", "23", "24", "25", "26"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 flex flex-row justify-between min-w-[900px]">
            <div className="flex flex-row w-full justify-start">
              <div
                key="3-BIS"
                className="relative flex flex-col items-center"
                onClick={() => handleTableClick("3-BIS")}
              >
                <div id="3-BIS" className={getTableClass("3-BIS")}>
                  {getOccupiedTableInfo("3-BIS")}
                </div>
                <div className="text-xs mt-0.5">3-BIS</div>
              </div>
            </div>
          </div>
          <div className="pt-2 flex flex-row justify-between min-w-[900px]">
            <div className="flex flex-row w-1/3 justify-between gap-2">
              {["2", "2-BIS", "1-BIS", "1"].map((table) => (
                <div
                  key={table}
                  className="relative flex flex-col items-center"
                  onClick={() => handleTableClick(table)}
                >
                  <div id={table} className={getTableClass(table)}>
                    {getOccupiedTableInfo(table)}
                  </div>
                  <div className="text-xs mt-0.5">{table}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded-md shadow-sm hover:bg-blue-600 transition duration-200"
            onClick={downloadPDF} // Lien vers la fonction de téléchargement
          >
            Télécharger le plan en PDF (Bêta)
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ml-2"
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
            date={date} // Passe date
            period={period}
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
