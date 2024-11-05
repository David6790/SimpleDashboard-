import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  CalendarIcon,
  EllipsisHorizontalIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import Calendar from "../Components/Calendar";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import {
  useGetOccupationStatusesQuery,
  usePostOccupationStatusMutation,
  useDeleteOccupationStatusMutation,
  useUpdateOccupationStatusMutation,
} from "../services/occupationStatusApi";
import ErrorModal from "../Components/ErrorModal";
import SuccessModal from "../Components/SuccessModal"; // Import du modal de succès
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

const occStatusTrigram = {
  FreeTable21: "F21",
  Service1Complet: "S1C",
  Service2Complet: "S2C",
  Complet: "CCC",
  MidiComplet: "MCC",
  MidiEtendu: "MET",
  MidiDoubleService: "MDS",
};

const occStatusInstructions = {
  FreeTable21:
    "Client ayant réservé à 19h sont informés qu'ils doivent libérer la table à 21h.",
  Service1Complet:
    "Client ne peuvent réserver que pour le 2e service à savoir à partir de 21h15",
  Service2Complet:
    "Client ayant réservé à 19h sont informés qu'ils doivent libérer la table à 21h.",
  Complet: "Restaurant complet. Aucune réservation possible pour cette date",
  MidiComplet:
    "Midi complet, sont réservables uniquement les réservations du soir",
  MidiEtendu:
    "Pour gérer un maximum de clients, le service a été élargi avec un début à 11h15 et une dernière réservation à 14h45.",
  MidiDoubleService:
    "Le service est organisé en double service. Les clients ayant réservé entre 11h et 12h doivent libérer la table à 13h30.",
  RAS: "Pas de configuration spécifique",
};

const occStatusOptions = [
  { value: "FreeTable21", label: "FreeTable21" },
  { value: "Service1Complet", label: "Service1Complet" },
  { value: "Service2Complet", label: "Service2Complet" },
  { value: "Complet", label: "Complet" },
  { value: "RAS", label: "RAS" },
];

const occStatusOptionsMidi = [
  { value: "MidiComplet", label: "MidiComplet" },
  { value: "MidiDoubleService", label: "MidiDoubleService" },
  { value: "MidiEtendu", label: "MidiEtendu" },
  { value: "RAS", label: "RAS" },
];

const formatDate = (date) => date.toLocaleDateString("en-CA");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

registerLocale("fr", fr);

export default function Example() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMidiStatus, setSelectedMidiStatus] = useState(null);
  const [selectedDinerStatus, setSelectedDinerStatus] = useState(null);
  const [deletingStatusId, setDeletingStatusId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newMidiStatus, setNewMidiStatus] = useState("");
  const [newDinerStatus, setNewDinerStatus] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: occupationStatuses = [],
    error,
    isLoading,
  } = useGetOccupationStatusesQuery();

  const [postOccupationStatus] = usePostOccupationStatusMutation();
  const [deleteOccupationStatus] = useDeleteOccupationStatusMutation();
  const [updateOccupationStatus] = useUpdateOccupationStatusMutation();

  const handleConfirm = async () => {
    const currentDate = new Date();
    const formattedDate = formatDate(selectedDate);

    const resetTime = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const selectedDateWithoutTime = resetTime(selectedDate);
    const currentDateWithoutTime = resetTime(currentDate);

    if (selectedDateWithoutTime < currentDateWithoutTime) {
      setModalErrorMessage(
        "La date ne peut pas être antérieure à la date du jour."
      );
      setIsErrorModalOpen(true); // Ouvrir le modal d'erreur
      return;
    }

    // Vérification pour remplacer "RAS" par une chaîne vide ""
    const midiStatusToSend =
      selectedMidiStatus && selectedMidiStatus.value !== "RAS"
        ? selectedMidiStatus.value
        : "";

    // Si rien n'est sélectionné pour le soir, envoyer une chaîne vide ""
    const dinerStatusToSend =
      selectedDinerStatus && selectedDinerStatus.value !== "RAS"
        ? selectedDinerStatus.value
        : "";

    try {
      await postOccupationStatus({
        dateOfEffect: formattedDate,
        occStatusMidi: midiStatusToSend, // Envoie "" si RAS ou rien n'est sélectionné
        occStatusDiner: dinerStatusToSend, // Envoie "" si RAS ou rien n'est sélectionné
      }).unwrap();

      // Si succès, on affiche le modal de succès
      setModalSuccessMessage("Statut d'occupation ajouté avec succès");
      setIsSuccessModalOpen(true);
      setSelectedMidiStatus(null);
      setSelectedDinerStatus(null);
    } catch (error) {
      if (error?.data?.message) {
        setModalErrorMessage(error.data.message);
      } else {
        setModalErrorMessage("Échec de l'ajout du statut d'occupation.");
      }
      setIsErrorModalOpen(true); // Ouvrir le modal d'erreur
    }
  };

  const handleEditConfirm = async (id) => {
    if (!newDinerStatus) {
      setModalErrorMessage("Le statut du dîner ne peut pas être vide.");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await updateOccupationStatus({
        id,
        occStatusMidi: newMidiStatus ? newMidiStatus.value : "RAS", // Si midi est null, envoyer 'RAS' par défaut
        occStatusDiner: newDinerStatus.value,
      }).unwrap();

      setModalSuccessMessage("Statut d'occupation mis à jour avec succès");
      setIsSuccessModalOpen(true);
      setEditingStatusId(null);
      setNewMidiStatus(null);
      setNewDinerStatus(null);
    } catch (error) {
      if (error?.data?.message) {
        setModalErrorMessage(error.data.message);
      } else {
        setModalErrorMessage("Échec de la mise à jour du statut d'occupation.");
      }
      setIsErrorModalOpen(true); // Ouvrir le modal d'erreur
    }
  };

  const handleEditCancel = () => {
    setEditingStatusId(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading occupation statuses</div>;

  // Filtrer les occupationStatuses par date
  const filteredOccupationStatuses = filterDate
    ? occupationStatuses.filter(
        (status) =>
          formatDate(new Date(status.dateOfEffect)) === formatDate(filterDate)
      )
    : occupationStatuses;

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteOccupationStatus(id).unwrap();

      // Afficher le message de succès
      setModalSuccessMessage("Statut d'occupation supprimé avec succès");
      setIsSuccessModalOpen(true);

      setDeletingStatusId(null);
    } catch (error) {
      console.error("Échec de la suppression du statut d'occupation:", error);
      setModalErrorMessage("Échec de la suppression du statut d'occupation");
      setIsErrorModalOpen(true); // Ouvrir le modal d'erreur
    }
  };

  const handleEdit = (id) => {
    const statusToEdit = occupationStatuses.find((status) => status.id === id);

    // Initialiser les nouveaux statuts avec les valeurs actuelles de la réservation
    if (statusToEdit) {
      setNewMidiStatus(
        occStatusOptionsMidi.find(
          (option) => option.value === statusToEdit.occStatusMidi
        ) || null
      );
      setNewDinerStatus(
        occStatusOptions.find(
          (option) => option.value === statusToEdit.occStatusDiner
        ) || null
      );
    }

    setEditingStatusId(id);
  };

  // Trier les occupationStatuses par date d'effet
  const sortedOccupationStatuses = filteredOccupationStatuses
    .slice()
    .sort((a, b) => new Date(a.dateOfEffect) - new Date(b.dateOfEffect));

  return (
    <Layout>
      {/* Modals for success and error messages */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        errorMessage={modalErrorMessage}
        onClose={() => setIsErrorModalOpen(false)}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        successMessage={modalSuccessMessage}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <SectionHeading title={"Gestion de l'occupation de la salle"} />

      <div className="px-10 mt-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
          {/* Div de gauche pour afficher les statuts déjà paramétrés */}
          <div className="lg:col-span-7 xl:col-span-8 border border-gray-200 rounded-lg px-5">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Les statuts d'occupation déjà paramétrés :
            </h2>
            <div className="mb-1 mt-10">
              <label
                htmlFor="filter-date"
                className="block text-sm font-medium text-gray-700"
              >
                Filtrer par date
              </label>
              <DatePicker
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholderText="Sélectionner une date"
                locale="fr"
              />
              <span
                className="ml-5 text-sm font-medium text-gray-700 underline cursor-pointer"
                onClick={() => setFilterDate(null)}
              >
                Afficher tout
              </span>
            </div>

            <ol className="divide-y divide-gray-100 text-sm leading-6">
              {sortedOccupationStatuses.map((status) => (
                <li
                  key={status.id}
                  className="relative flex space-x-6 py-6 xl:static"
                >
                  <div className="h-14 text-xs w-14 text-center flex-none rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {occStatusTrigram[status.occStatusMidi]
                      ? occStatusTrigram[status.occStatusMidi] + " /"
                      : ""}{" "}
                    {occStatusTrigram[status.occStatusDiner]}
                  </div>
                  <div className="flex-auto">
                    <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                      Midi : {status.occStatusMidi} / Soir:{" "}
                      {status.occStatusDiner}
                    </h3>
                    <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                      <div
                        className="flex items-start space-x-3 flex-none"
                        style={{ width: "200px" }}
                      >
                        <dt className="mt-0.5">
                          <span className="sr-only">Date</span>
                          <CalendarIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd>
                          <time dateTime={status.dateOfEffect}>
                            {new Date(status.dateOfEffect).toLocaleDateString(
                              "fr-FR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </time>
                        </dd>
                      </div>
                      <div className="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                        <dt className="mt-0.5">
                          <span className="sr-only">Instruction:</span>
                          <InformationCircleIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd>
                          Midi:{" "}
                          {occStatusInstructions[status.occStatusMidi] || "N/A"}
                          <br />
                          <br />{" "}
                          {/* Cette ligne ajoute un saut de ligne entre les instructions */}
                          Soir:{" "}
                          {occStatusInstructions[status.occStatusDiner] ||
                            "N/A"}
                        </dd>
                      </div>
                    </dl>
                    {editingStatusId === status.id && (
                      <div className="mt-2 p-4 border border-yellow-500 bg-yellow-50 text-yellow-800 rounded-md">
                        <p>
                          À la date{" "}
                          <strong>
                            {new Date(status.dateOfEffect).toLocaleDateString(
                              "fr-FR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </strong>
                          , le statut d'occupation est{" "}
                          <strong>{status.occStatusMidi}</strong> (midi) et{" "}
                          <strong>{status.occStatusDiner}</strong> (dîner).
                        </p>
                        <p>Choisissez les nouveaux statuts :</p>

                        {/* Ajout des labels pour Midi et Soir */}
                        <label className="block text-sm font-bold leading-6 text-gray-900 mt-4">
                          Midi :
                        </label>
                        <Listbox
                          value={newMidiStatus}
                          onChange={setNewMidiStatus}
                        >
                          {({ open }) => (
                            <>
                              <div className="relative mt-2">
                                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                  <span className="block truncate">
                                    {newMidiStatus
                                      ? newMidiStatus.label
                                      : "Sélectionner un statut pour le midi"}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </ListboxButton>
                                <Transition
                                  show={open}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {occStatusOptionsMidi.map((status) => (
                                      <ListboxOption
                                        key={status.value}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "bg-indigo-600 text-white"
                                              : "",
                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                          )
                                        }
                                        value={status}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <span
                                              className={classNames(
                                                selected
                                                  ? "font-semibold"
                                                  : "font-normal",
                                                "block truncate"
                                              )}
                                            >
                                              {status.label}
                                            </span>
                                            {selected ? (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "text-white"
                                                    : "text-indigo-600",
                                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </ListboxOption>
                                    ))}
                                  </ListboxOptions>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>

                        {/* Label pour Soir */}
                        <label className="block text-sm font-bold leading-6 text-gray-900 mt-4">
                          Soir :
                        </label>
                        <Listbox
                          value={newDinerStatus}
                          onChange={setNewDinerStatus}
                        >
                          {({ open }) => (
                            <>
                              <div className="relative mt-2">
                                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                  <span className="block truncate">
                                    {newDinerStatus
                                      ? newDinerStatus.label
                                      : "Sélectionner un statut pour le dîner"}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </ListboxButton>
                                <Transition
                                  show={open}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {occStatusOptions.map((status) => (
                                      <ListboxOption
                                        key={status.value}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "bg-indigo-600 text-white"
                                              : "",
                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                          )
                                        }
                                        value={status}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <span
                                              className={classNames(
                                                selected
                                                  ? "font-semibold"
                                                  : "font-normal",
                                                "block truncate"
                                              )}
                                            >
                                              {status.label}
                                            </span>
                                            {selected ? (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "text-white"
                                                    : "text-indigo-600",
                                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </ListboxOption>
                                    ))}
                                  </ListboxOptions>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>

                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={handleEditCancel}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleEditConfirm(status.id)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-md"
                          >
                            Confirmer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Menu
                    as="div"
                    className="absolute right-0 top-6 xl:relative xl:right-auto xl:top-auto xl:self-center"
                  >
                    <div>
                      <MenuButton className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <EllipsisHorizontalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </MenuButton>
                    </div>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleDeleteConfirm(status.id)}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Supprimer
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleEdit(status.id)}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Modifier
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </li>
              ))}
            </ol>
          </div>

          {/* Div de droite pour ajouter un nouveau statut */}
          <div className="mt-5 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
            <div className="mt-6 w-full max-w-sm mx-auto">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              <Listbox
                value={selectedMidiStatus}
                onChange={setSelectedMidiStatus}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm  leading-6 text-gray-900 mt-5 font-bold">
                      Choisir un statut pour le midi
                    </Listbox.Label>
                    <div className="relative mt-2">
                      <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                        <span className="block truncate">
                          {selectedMidiStatus
                            ? selectedMidiStatus.label
                            : "Pas de modification"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </ListboxButton>
                      <Transition
                        show={open}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {occStatusOptionsMidi.map((status) => (
                            <ListboxOption
                              key={status.value}
                              className={({ active }) =>
                                classNames(
                                  active ? "bg-indigo-600 text-white" : "",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={status}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "block truncate"
                                    )}
                                  >
                                    {status.label}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <Listbox
                value={selectedDinerStatus}
                onChange={setSelectedDinerStatus}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-bold leading-6 text-gray-900 mt-4">
                      Choisir un statut pour le dîner
                    </Listbox.Label>
                    <div className="relative mt-2">
                      <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                        <span className="block truncate">
                          {selectedDinerStatus
                            ? selectedDinerStatus.label
                            : "Sélectionner un statut"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </ListboxButton>
                      <Transition
                        show={open}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {occStatusOptions.map((status) => (
                            <ListboxOption
                              key={status.value}
                              className={({ active }) =>
                                classNames(
                                  active ? "bg-indigo-600 text-white" : "",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={status}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "block truncate"
                                    )}
                                  >
                                    {status.label}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <div className="mt-8 flex justify-evenly">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-1/3"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 w-1/3"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
