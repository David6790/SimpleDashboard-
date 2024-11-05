import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js"; // Importation du parser
import TimeSlotSelector from "./TimeSlotSelector";
import OccStatusDisplay from "./OccStatusDisplay";
import ValidationMessage from "./ValidationMessage";
import { useCreateReservationMutation } from "../services/reservations";
import { validateNumberOfPeople, validateDate } from "./ValidationSaisie";
import { useGetNotificationToggleQuery } from "../services/toggleApi";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorModal from "./ErrorModal"; // Importation du modal d'erreur
import ConfirmationModalStaff from "./ConfirmationModalStaff";

export default function ReservationForm() {
  const navigate = useNavigate();
  const [createReservation] = useCreateReservationMutation();

  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [submitMessage, setSubmitMessage] = useState(""); // Message à afficher après la soumission
  const [reservationDetails, setReservationDetails] = useState(null); // État pour les détails de la réservation

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // État pour contrôler la visibilité du modal d'erreur
  const [errorMessage, setErrorMessage] = useState(""); // État pour stocker le message d'erreur

  // Ajout des nouveaux états pour le statut du midi et du dîner
  const [occStatusLunch, setOccStatusLunch] = useState("");
  const [occStatusDinner, setOccStatusDinner] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetch: refetchToggle } = useGetNotificationToggleQuery(); // Refetch pour le toggle

  const user = useSelector((state) => state.user);

  // Fonction pour gérer le changement de date
  const handleDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setStartDate(formattedDate);
    if (!validateDate(formattedDate)) {
      setErrors((errors) => ({
        ...errors,
        date: "La date doit être aujourd'hui ou dans le futur.",
      }));
    } else {
      setErrors((errors) => ({ ...errors, date: null }));
    }
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleNumberOfGuestsChange = (event) => {
    const number = event.target.value;
    setNumberOfGuests(number);
    const error = validateNumberOfPeople(number)
      ? ""
      : "Le nombre de personnes doit être un entier positif et non nul.";
    setErrors((prev) => ({ ...prev, numberOfGuests: error }));
  };

  const handlePhoneChange = (event) => {
    const inputPhone = event.target.value;
    const phoneNumber = parsePhoneNumberFromString(inputPhone, "FR"); // Utilisation du parser
    if (phoneNumber && phoneNumber.isValid()) {
      setPhone(phoneNumber.formatInternational());
    } else {
      setPhone(inputPhone);
    }

    const error =
      inputPhone.trim() === ""
        ? "Le numéro de téléphone ne peut pas être vide."
        : "";
    setErrors((prev) => ({ ...prev, phone: error }));
  };

  const handleCommentChange = (event) => {
    const value = event.target.value;
    if (value.length <= 1000) {
      setComment(value);
    } else {
      setErrors((errors) => ({
        ...errors,
        comment: "Le commentaire ne doit pas dépasser 1000 caractères.",
      }));
    }
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    setName(value);
    const error = value.trim() === "" ? "Le nom ne peut pas être vide." : "";
    setErrors((prev) => ({ ...prev, name: error }));
  };

  const handlePrenomChange = (event) => {
    const { value } = event.target;
    setPrenom(value);
  };

  // Gérer le changement de créneau horaire
  const handleTimeSlotChange = (event) => {
    const selectedTime = event.target.value;
    const currentDate = new Date();
    const selectedDateTime = new Date(`${startDate}T${selectedTime}`);

    if (selectedDateTime < currentDate) {
      setErrors((prev) => ({
        ...prev,
        timeSlot: "Le créneau horaire ne peut pas être dans le passé.",
      }));
      setSelectedTimeSlot("");
    } else {
      setErrors((prev) => ({ ...prev, timeSlot: null }));
      setSelectedTimeSlot(selectedTime);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formErrors = {
      numberOfGuests: validateNumberOfPeople(numberOfGuests)
        ? ""
        : "Le nombre de personnes doit être un entier positif et non nul.",
      phone:
        phone.trim() === ""
          ? "Le numéro de téléphone ne peut pas être vide."
          : "",
      date: validateDate(startDate)
        ? ""
        : "La date doit être aujourd'hui ou dans le futur.",
      name: name.trim() === "" ? "Le nom ne peut pas être vide." : "",

      timeSlot:
        selectedTimeSlot === ""
          ? "Le créneau horaire ne peut pas être vide."
          : "",
    };

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    if (
      selectedTimeSlot === "19:00" &&
      (occStatusDinner === "FreeTable21" ||
        occStatusDinner === "Service2Complet")
    ) {
      setConfirmationMessage(
        "En raison de la forte demande et pour garantir une expérience agréable à chaque client, avez-vous bien informé le client qu'il devra libérer la table à 21h pour permettre le service suivant ? Merci de votre confirmation."
      );
      setConfirmAction(() => submitReservation); // Enregistre l'action de soumission pour le modal
      setIsConfirmationModalOpen(true); // Ouvre le modal de confirmation
    } else if (
      parseInt(selectedTimeSlot) <= 12 &&
      occStatusLunch === "MidiDoubleService"
    ) {
      setConfirmationMessage(
        "En raison de la forte demande et pour garantir une expérience agréable à chaque client, avez-vous bien informé le client qu'il devra libérer la table à 13h30 pour permettre le service suivant ? Merci de votre confirmation."
      );
      setConfirmAction(() => submitReservation);
      setIsConfirmationModalOpen(true);
    } else {
      submitReservation();
    }
  };
  const submitReservation = async () => {
    try {
      const reservation = {
        dateResa: startDate,
        timeResa: selectedTimeSlot,
        numberOfGuest: numberOfGuests.toString(),
        comment: comment,
        clientName: name,
        clientPrenom: prenom,
        clientTelephone: phone,
        clientEmail: email,
        occupationStatusSoirOnBook: occStatusDinner,
        OccupationStatusMidiOnBook: occStatusLunch,
        createdBy: user.username,
        origin: "OPC",
      };

      await createReservation(reservation).unwrap();

      setReservationDetails(reservation);
      setSubmitMessage("Réservation effectuée avec succès !");
      resetForm();
      await refetchToggle();
    } catch (error) {
      setErrorMessage(
        error?.data?.error ||
          "Erreur lors de la réservation. Veuillez réessayer."
      );
      setIsErrorModalOpen(true);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setPhone("");
    setEmail("");
    setName("");
    setPrenom("");
    setNumberOfGuests("");
    setComment("");
    setSelectedTimeSlot("");
    setErrors({});
    setOccStatusLunch("");
    setOccStatusDinner("");
  };

  const handlePlaceTable = () => {
    if (reservationDetails) {
      navigate(`/?redirect=true&date=${reservationDetails.dateResa}`);
    }
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Informations du service Déjeuner
          </h2>
          <OccStatusDisplay status={occStatusLunch} />{" "}
          {/* Afficher le statut du midi */}
          <h2 className="mt-8 text-base font-semibold leading-7 text-gray-900">
            Informations du service Dîner
          </h2>
          <OccStatusDisplay status={occStatusDinner} />{" "}
          {/* Afficher le statut du soir */}
          {submitMessage && <ValidationMessage message={submitMessage} />}
          {reservationDetails && (
            <div>
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                <p className="font-bold text-lg">
                  Réservation réussie ! Voici les détails de la réservation :
                </p>
                <ul className="list-none list-inside space-y-2 mt-4">
                  <li>
                    <span className="font-bold">Date :</span>{" "}
                    {reservationDetails.dateResa}
                  </li>
                  <li>
                    <span className="font-bold">Heure :</span>{" "}
                    {reservationDetails.timeResa}
                  </li>
                  <li>
                    <span className="font-bold">Nombre de personnes :</span>{" "}
                    {reservationDetails.numberOfGuest}
                  </li>
                  <li>
                    <span className="font-bold">Nom :</span>{" "}
                    {reservationDetails.clientName}
                  </li>
                  <li>
                    <span className="font-bold">Prénom :</span>{" "}
                    {reservationDetails.clientPrenom}
                  </li>
                  <li>
                    <span className="font-bold">Téléphone :</span>{" "}
                    {reservationDetails.clientTelephone}
                  </li>
                  <li>
                    <span className="font-bold">Email :</span>{" "}
                    {reservationDetails.clientEmail}
                  </li>
                  <li>
                    <span className="font-bold">Commentaire :</span>{" "}
                    {reservationDetails.comment}
                  </li>
                </ul>
                <button
                  onClick={handlePlaceTable}
                  className="mt-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Placer la table
                </button>
              </div>
            </div>
          )}
        </div>

        <form
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={handleSubmit}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="col-span-full mb-5">
              <h1 className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Sélectionnez la date de la réservation
              </h1>
              <DatePicker
                selected={new Date(startDate)}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                showYearDropdown
                scrollableMonthYearDropdown
                className="block w-full px-3 py-2 mt-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              {errors.date && <div style={{ color: "red" }}>{errors.date}</div>}
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nom
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    value={name}
                    onChange={handleNameChange}
                    required
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.name && (
                    <div style={{ color: "red" }}>{errors.name}</div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Prénom
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    value={prenom}
                    onChange={handlePrenomChange}
                    autoComplete="family-name"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.prenom && (
                    <div style={{ color: "red" }}>{errors.prenom}</div>
                  )}
                </div>
              </div>

              {/* Appel du TimeSlotSelector pour gérer les créneaux horaires */}
              <TimeSlotSelector
                date={startDate}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotChange={handleTimeSlotChange}
                setOccStatusLunch={setOccStatusLunch} // Setter pour le midi
                setOccStatusDinner={setOccStatusDinner} // Setter pour le soir
                required
              />
              {errors.timeSlot && (
                <div className="sm:col-span-6" style={{ color: "red" }}>
                  {errors.timeSlot}
                </div>
              )}

              <div className="sm:col-span-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Numéro de téléphone
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                  {errors.phone && (
                    <div style={{ color: "red" }}>{errors.phone}</div>
                  )}
                </div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 mt-5"
                >
                  Adresse Email
                </label>
                <div className="mt-2 mb-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email && (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="numberOfGuest"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nombre de personne(s)
                </label>
                <div className="mt-2">
                  <input
                    id="numberOfGuest"
                    name="numberOfGuest"
                    type="text"
                    value={numberOfGuests}
                    required
                    onChange={handleNumberOfGuestsChange}
                    className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.numberOfGuests && (
                    <div style={{ color: "red" }}>{errors.numberOfGuests}</div>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Commentaire
                </label>
                <div className="mt-2">
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    value={comment}
                    onChange={handleCommentChange}
                    maxLength="1000"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.comment && (
                    <div style={{ color: "red" }}>{errors.comment}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <NavLink to={"/"}>
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Annuler
              </button>
            </NavLink>
            {isSubmitting ? (
              <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                En cours...
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Enregistrer
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        errorMessage={errorMessage}
        onClose={() => setIsErrorModalOpen(false)}
      />
      <ConfirmationModalStaff
        isOpen={isConfirmationModalOpen}
        message={confirmationMessage}
        onConfirm={() => {
          confirmAction();
          setIsConfirmationModalOpen(false);
        }}
        onCancel={() => {
          resetForm();
          setIsConfirmationModalOpen(false);
        }}
      />
    </div>
  );
}
