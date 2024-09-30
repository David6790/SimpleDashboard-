import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  CalendarIcon,
  EllipsisHorizontalIcon,
  InformationCircleIcon,
  CheckIcon,
  ChevronUpDownIcon,
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

const occStatusTrigram = {
  FreeTable21: "F21",
  Service1Complet: "S1C",
  Service2Complet: "S2C",
  Complet: "CCC",
  MidiComplet: "MCC",
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
};

const occStatusOptions = [
  { value: "FreeTable21", label: "FreeTable21" },
  { value: "Service1Complet", label: "Service1Complet" },
  { value: "Service2Complet", label: "Service2Complet" },
  { value: "Complet", label: "Complet" },
  { value: "MidiComplet", label: "MidiComplet" },
];

const formatDate = (date) => {
  return date.toLocaleDateString("en-CA");
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(null);
  const {
    data: occupationStatuses = [],
    error,
    isLoading,
  } = useGetOccupationStatusesQuery();
  const [postOccupationStatus] = usePostOccupationStatusMutation();
  const [deleteOccupationStatus] = useDeleteOccupationStatusMutation();
  const [updateOccupationStatus] = useUpdateOccupationStatusMutation();

  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  // eslint-disable-next-line
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingStatusId, setDeletingStatusId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const handleConfirm = async () => {
    const currentDate = new Date();
    const formattedDate = formatDate(selectedDate);

    // Reset the time portion of both dates
    const resetTime = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const selectedDateWithoutTime = resetTime(selectedDate);
    const currentDateWithoutTime = resetTime(currentDate);

    if (selectedDateWithoutTime < currentDateWithoutTime) {
      setErrorMessage("La date ne peut pas être antérieure à la date du jour.");
      console.log(selectedDateWithoutTime, currentDateWithoutTime);
      return;
    }

    if (!selectedStatus) {
      setErrorMessage("Le statut ne peut pas être vide.");
      return;
    }

    try {
      await postOccupationStatus({
        dateOfEffect: formattedDate,
        occStatus: selectedStatus.value,
      }).unwrap();
      setSuccessMessage("Statut d'occupation ajouté avec succès");
      setIsAddingStatus(false);
      setSelectedStatus(null);
      setErrorMessage("");
    } catch (error) {
      if (error.status === 409) {
        const conflictDate = new Date(error.data.occupations[0].dateOfEffect);
        setFilterDate(conflictDate);
        setErrorMessage("Statut d'occupation déjà configuré pour cette date.");
      } else {
        console.error("Échec de l'ajout du statut d'occupation:", error);
        setErrorMessage("Échec de l'ajout du statut d'occupation");
      }
    }
  };

  const handleCancelAdd = () => {
    setIsAddingStatus(false);
    setSelectedStatus(null);
    setErrorMessage("");
  };

  const handleDelete = async (id) => {
    try {
      const deletedStatus = await deleteOccupationStatus(id).unwrap();
      alert(
        `Statut d'occupation '${deletedStatus.occStatus}' supprimé pour la date '${deletedStatus.dateOfEffect}'`
      );
      setDeletingStatusId(null);
      setFilterDate(null);
    } catch (error) {
      console.error("Échec de la suppression du statut d'occupation:", error);
      alert("Échec de la suppression du statut d'occupation");
    }
  };

  const handleDeleteConfirm = (id) => {
    setDeletingStatusId(id);
  };

  const handleDeleteCancel = () => {
    setDeletingStatusId(null);
  };

  const handleEdit = (id) => {
    setEditingStatusId(id);
  };

  const handleEditConfirm = async (id) => {
    if (!newStatus) {
      setErrorMessage("Le nouveau statut ne peut pas être vide.");
      return;
    }

    try {
      await updateOccupationStatus({
        id,
        newOccStatus: newStatus.value,
      }).unwrap();
      setSuccessMessage("Statut d'occupation mis à jour avec succès");
      setEditingStatusId(null);
      setNewStatus(null);
      setErrorMessage("");

      setTimeout(() => {
        setFilterDate(null);
      }, 3000);
    } catch (error) {
      console.error("Échec de la mise à jour du statut d'occupation:", error);
      setErrorMessage("Échec de la mise à jour du statut d'occupation");
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

  // Trier les occupationStatuses par date d'effet
  const sortedOccupationStatuses = filteredOccupationStatuses
    .slice()
    .sort((a, b) => new Date(a.dateOfEffect) - new Date(b.dateOfEffect));

  return (
    <Layout>
      <SectionHeading title={"Gestion de l'occupation de la salle"} />
      <div className="px-10 mt-20">
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
          />
          <span
            className="ml-5 text-sm font-medium text-gray-700 underline cursor-pointer"
            onClick={() => setFilterDate(null)}
          >
            Afficher tout
          </span>
        </div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
          <div className="mt-5 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
            <div className="mt-6 w-full max-w-sm mx-auto">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              {isAddingStatus ? (
                <>
                  <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                          Choisir un statut
                        </Listbox.Label>
                        <div className="relative mt-2">
                          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="block truncate">
                              {selectedStatus
                                ? selectedStatus.label
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
                  {errorMessage && (
                    <p className="text-red-500 mt-2">{errorMessage}</p>
                  )}
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
                      onClick={handleCancelAdd}
                      className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 w-1/3"
                    >
                      Annuler
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingStatus(true);
                    setSuccessMessage("");
                  }}
                  className="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Ajouter un Statut
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 lg:col-span-7 xl:col-span-8 border border-gray-200 rounded-lg px-5">
            <ol className="divide-y divide-gray-100 text-sm leading-6">
              {sortedOccupationStatuses.map((status) => (
                <li
                  key={status.id}
                  className="relative flex space-x-6 py-6 xl:static"
                >
                  <div className="h-14 w-14 flex-none rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {occStatusTrigram[status.occStatus] || "N/A"}
                  </div>
                  <div className="flex-auto">
                    <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                      {status.occStatus}
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
                          {occStatusInstructions[status.occStatus] || "N/A"}
                        </dd>
                      </div>
                    </dl>
                    {deletingStatusId === status.id && (
                      <div className="mt-2 p-4 border border-red-500 bg-red-50 text-red-800 rounded-md">
                        <p>
                          Êtes-vous sûr de vouloir supprimer le statut{" "}
                          <strong>{status.occStatus}</strong> pour la date{" "}
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
                          ? Cette action est irréversible et la date passera en
                          "RAS".
                        </p>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={handleDeleteCancel}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleDelete(status.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md"
                          >
                            Confirmer
                          </button>
                        </div>
                      </div>
                    )}
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
                          <strong>{status.occStatus}</strong>.
                        </p>
                        <p>Choisissez le nouveau statut :</p>
                        <Listbox value={newStatus} onChange={setNewStatus}>
                          {({ open }) => (
                            <>
                              <div className="relative mt-2">
                                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                  <span className="block truncate">
                                    {newStatus
                                      ? newStatus.label
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
        </div>
      </div>
    </Layout>
  );
}
