import React, { useState, useEffect } from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import PreviewTableDashboard from "../Components/PreviewTableDashboard";
import BanniereStat from "../Components/BanniereStat";

import { useGetReservationsByDateQuery } from "../services/reservations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ModalViewPlan from "./ModalViewPlan";
import ModalViewPlanMidi from "./ModalViewPlanMidi";
import { Switch } from "@headlessui/react";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalMidiOpen, setIsModalMidiOpen] = useState(false); // Pour le modal Midi
  const [isModalSoirOpen, setIsModalSoirOpen] = useState(false); // Pour le modal Soir
  const [filter, setFilter] = useState("all");
  const [MDOReservations, setMDOReservations] = useState([]);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const {
    data: reservations,
    isError,
    error,
    refetch,
  } = useGetReservationsByDateQuery(formattedDate);

  const refreshReservations = () => {
    refetch();
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    const date = params.get("date");
    if (redirect === "true" && date) {
      setSelectedDate(new Date(date));
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    // Fetch and filter data from SheetDB
    const fetchAndFilterMDOReservations = async () => {
      try {
        const response = await fetch("https://sheetdb.io/api/v1/97lppk2d46b57");
        const data = await response.json();

        // Date limite pour filtrer (3 novembre 2024)
        const filterDate = new Date(2024, 10, 3); // Mois 10 pour novembre (les mois sont 0-indexés en JavaScript)

        // Filtrer les réservations
        const filteredMDOReservations = data.filter((reservation) => {
          // Convertir la date du format "02-11-24" à un objet Date
          const reservationDate = parse(
            reservation.Date,
            "dd-MM-yy",
            new Date()
          );

          // Vérifier si la date est postérieure au 3 novembre 2024 et que le statut est "Confirmé"
          return (
            reservationDate > filterDate && reservation.Status === "Confirmé"
          );
        });

        console.log("MDO Réservations filtrées :", filteredMDOReservations);
        setMDOReservations(filteredMDOReservations);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de SheetDB :",
          error
        );
      }
    };

    fetchAndFilterMDOReservations();
  }, []);

  const transformToReservationDTO = (oldReservation) => {
    // Décomposer le champ "Name" en nom et prénom, en utilisant un ou plusieurs espaces comme séparateur
    const [ClientName, ClientPrenom = "   "] = oldReservation.Name.split(/\s+/);

    // Supprimer les 2 premiers caractères de Phone (le "n°")
    const ClientTelephone = oldReservation.Phone.slice(2);

    // Formatter la date "dd-MM-yy" en "yyyy-MM-dd"
    const DateResa = format(
      parse(oldReservation.Date, "dd-MM-yy", new Date()),
      "yyyy-MM-dd"
    );

    // Formatter l'heure pour qu'elle corresponde au format "HH:mm"
    const TimeResa = oldReservation.Time.slice(0, 5); // Prend "20:00" à partir de "20:00:00"

    // Formater l'objet en fonction de la DTO attendue
    return {
      DateResa: DateResa, // Date au format "yyyy-MM-dd"
      TimeResa: TimeResa, // Heure sans les secondes
      NumberOfGuest: parseInt(oldReservation.NumberGuest, 10), // Conversion en entier
      Comment: oldReservation.Comment || "", // Commentaire
      OccupationStatusMidiOnBook: "RAS", // Toujours "RAS"
      OccupationStatusSoirOnBook: oldReservation.OccupationStatus, // Statut pour le soir
      CreatedBy: "MDO", // Créateur défini comme "MDO"
      FreeTable21: oldReservation.freeTable21h === "Client prévenu" ? "O" : "N", // Déterminer si "O" ou "N"
      FreeTable1330: "N", // Pas nécessaire, valeur par défaut
      UpdatedBy: "MDO", // Marqué comme "MDO"
      CanceledBy: "", // Non renseigné
      origin: "MDO", // Indique que la source est "MDO"
      DoubleConfirmation: "", // Valeur par défaut
      Notifications: "", // Valeur par défaut
      Status: oldReservation.Status === "Confirmé" ? "C" : "", // "C" pour confirmé

      // Informations sur le client
      ClientName: ClientName, // Première partie de Name
      ClientPrenom: ClientPrenom, // Deuxième partie ou trois espaces si vide
      ClientTelephone: ClientTelephone, // Numéro de téléphone sans le "n°"
      ClientEmail: oldReservation.Email || "", // Email du client
    };
  };

  // Gérer l'ouverture des modals séparément
  const handleOpenMidiModal = () => {
    setIsModalMidiOpen(true);
  };

  useEffect(() => {
    // Fetch data from SheetDB on page load
    const fetchSheetDBData = async () => {
      try {
        const response = await fetch("https://sheetdb.io/api/v1/97lppk2d46b57");
        const data = await response.json();
        console.log("Données récupérées de SheetDB :", data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de SheetDB :",
          error
        );
      }
    };

    fetchSheetDBData();
  }, []);

  const handleMDOClick = async () => {
    try {
      for (const reservation of MDOReservations) {
        // Transformer la réservation au format attendu par l'API
        const formattedReservation = transformToReservationDTO(reservation);

        const response = await fetch(
          "https://localhost:7268/api/Reservations/create-resamdo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedReservation),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erreur lors de l'ajout de la réservation : ${response.statusText}`
          );
        }

        console.log(`Réservation ajoutée :`, formattedReservation);
      }
      alert("Toutes les réservations MDO ont été ajoutées avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi des réservations MDO :", error);
      alert("Une erreur est survenue lors de l'envoi des réservations MDO.");
    }
  };

  const handleOpenSoirModal = () => {
    setIsModalSoirOpen(true);
  };

  // Gérer la fermeture des modals séparément
  const handleCloseMidiModal = () => {
    setIsModalMidiOpen(false);
  };

  const handleCloseSoirModal = () => {
    setIsModalSoirOpen(false);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredReservations = reservations
    ? reservations.filter((reservation) => {
        const reservationTime = parseInt(
          reservation.timeResa.replace(/:/g, ""),
          10
        );
        if (filter === "midi") {
          return reservationTime < 140000; // 14:00:00
        } else if (filter === "soir") {
          return reservationTime >= 140000; // 14:00:00 and onwards
        }
        return true; // 'all' filter shows all reservations
      })
    : [];

  return (
    <Layout>
      <SectionHeading title={"IL GIRASOLE"} />
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Réservations du :
            </label>
            <div className="flex items-center space-x-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="mt-2 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleOpenMidiModal} // Ouvrir le modal pour midi
                className="mt-2 block rounded-md bg-green-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Voir plan Midi
              </button>
              <button
                type="button"
                onClick={handleOpenSoirModal} // Ouvrir le modal pour soir
                className="mt-2 block rounded-md bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Voir plan Soir
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Liste des réservations du : {format(selectedDate, "dd/MM/yyyy")}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <NavLink to={"/reservation-page"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Ajouter une réservation
              </button>
            </NavLink>
            <button onClick={handleMDOClick}>MDO</button>
          </div>
        </div>
      </div>

      <BanniereStat
        reservations={filteredReservations}
        selectedDate={selectedDate}
      />

      {/* Toggle Filters */}
      <div className="mt-4 space-y-2 flex gap-4">
        <div className="flex items-center">
          <Switch
            checked={filter === "all"}
            onChange={() => handleFilterChange("all")}
            className={`${
              filter === "all" ? "bg-indigo-600" : "bg-gray-200"
            } group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
          >
            <span className="sr-only">Afficher toutes les réservations</span>
            <span
              aria-hidden="true"
              className={`${
                filter === "all" ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-3">Toutes les réservations</span>
        </div>

        <div className="flex items-center">
          <Switch
            checked={filter === "midi"}
            onChange={() => handleFilterChange("midi")}
            className={`${
              filter === "midi" ? "bg-indigo-600" : "bg-gray-200"
            } group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
          >
            <span className="sr-only">
              Afficher uniquement les réservations du midi
            </span>
            <span
              aria-hidden="true"
              className={`${
                filter === "midi" ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-3">Réservations du midi</span>
        </div>

        <div className="flex items-center">
          <Switch
            checked={filter === "soir"}
            onChange={() => handleFilterChange("soir")}
            className={`${
              filter === "soir" ? "bg-indigo-600" : "bg-gray-200"
            } group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
          >
            <span className="sr-only">
              Afficher uniquement les réservations du soir
            </span>
            <span
              aria-hidden="true"
              className={`${
                filter === "soir" ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-3">Réservations du soir</span>
        </div>
      </div>

      <PreviewTableDashboard
        reservations={filteredReservations}
        isError={isError}
        error={error}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        refreshReservations={refreshReservations}
      />

      {isModalMidiOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={handleCloseMidiModal}
            >
              X
            </button>
            <ModalViewPlanMidi
              date={formattedDate}
              period="midi"
              onClose={handleCloseMidiModal}
            />
          </div>
        </div>
      )}

      {isModalSoirOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={handleCloseSoirModal}
            >
              X
            </button>
            <ModalViewPlan
              date={formattedDate}
              period="soir"
              onClose={handleCloseSoirModal}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
