import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import TimeSlotSelector from "./TimeSlotSelector";

import ValidationMessage from "./ValidationMessage";
import { useUpdateReservationMutation } from "../services/reservations";
import { useGetAllocationsQuery } from "../services/allocationsApi";
import { validateNumberOfPeople, validateDate } from "./ValidationSaisie";
import { useLocation, useNavigate } from "react-router-dom";

import SectionHeading from "./SectionHeading";
import ErrorModal from "./ErrorModal"; // Importation du modal d'erreur
import OccStatusDisplayClient from "./OccStatusDisplayClient";

export default function UpdateResaFormClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const resa = location.state?.reservation;

  const reservationId = resa.id; // Récupérer l'ID de la réservation
  // eslint-disable-next-line
  const [updateReservation, { isLoading }] = useUpdateReservationMutation();

  const [startDate, setStartDate] = useState(
    format(new Date(resa.dateResa), "yyyy-MM-dd")
  );
  const [phone, setPhone] = useState(resa.client.telephone);
  const [email, setEmail] = useState(resa.client.email);
  const [name, setName] = useState(resa.client.name);
  const [prenom, setPrenom] = useState(resa.client.prenom);
  const [numberOfGuests, setNumberOfGuests] = useState(
    resa.numberOfGuest.toString()
  );
  const [comment, setComment] = useState(resa.comment || "");
  const [errors, setErrors] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [occStatus, setOccStatus] = useState(resa.occupationStatusOnBook);
  const [submitMessage, setSubmitMessage] = useState("");
  const [reservationDetails, setReservationDetails] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // État pour gérer le bouton de soumission
  const [countdown, setCountdown] = useState(5); // État pour le compteur

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // État pour contrôler la visibilité du modal d'erreur
  const [errorMessage, setErrorMessage] = useState(""); // État pour stocker le message d'erreur

  // Hook pour obtenir et rafraîchir les allocations
  const { refetch } = useGetAllocationsQuery({
    date: format(new Date(resa.dateResa), "yyyy-MM-dd"),
    period:
      new Date(`1970-01-01T${resa.timeResa}`) < new Date(`1970-01-01T14:00:00`)
        ? "midi"
        : "soir",
  });

  useEffect(() => {
    if (resa) {
      setStartDate(format(new Date(resa.dateResa), "yyyy-MM-dd"));
      setPhone(resa.client.telephone);
      setEmail(resa.client.email);
      setName(resa.client.name);
      setPrenom(resa.client.prenom);
      setNumberOfGuests(resa.numberOfGuest.toString());
      setComment(resa.comment || "");
      setSelectedTimeSlot("");
      setOccStatus(resa.occupationStatusOnBook);
    }
  }, [resa]);

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

  const handleNumberOfGuestsChange = (event) => {
    const number = event.target.value;
    setNumberOfGuests(number);
    const error = validateNumberOfPeople(number)
      ? ""
      : "Le nombre de personnes doit être un entier positif et non nul.";
    setErrors((prev) => ({ ...prev, numberOfGuests: error }));
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

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
    const error =
      event.target.value === ""
        ? "Le créneau horaire ne peut pas être vide."
        : "";
    setErrors((prev) => ({ ...prev, timeSlot: error }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = {
      numberOfGuests: validateNumberOfPeople(numberOfGuests)
        ? ""
        : "Le nombre de personnes doit être un entier positif et non nul.",
      date: validateDate(startDate)
        ? ""
        : "La date doit être aujourd'hui ou dans le futur.",
      timeSlot:
        selectedTimeSlot === ""
          ? "Le créneau horaire ne peut pas être vide."
          : "",
    };

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      return;
    }

    try {
      const updatedReservation = {
        dateResa: startDate,
        timeResa: selectedTimeSlot,
        numberOfGuest: numberOfGuests.toString(),
        comment: comment,
        occupationStatusOnBook: occStatus,
        createdBy: resa.createdBy,
        freeTable21: resa.freeTable21,
        placed: resa.placed,
        clientName: resa.client.name,
        clientPrenom: resa.client.prenom,
        clientTelephone: resa.client.telephone,
        clientEmail: resa.client.email,
        updatedBy: "Client",
        origin: "Client",
      };
      console.log(updatedReservation);
      const response = await updateReservation({
        id: resa.id,
        ...updatedReservation,
      }).unwrap();

      // Forcer le rechargement des allocations après la mise à jour
      refetch();

      setReservationDetails(response);
      setSubmitMessage("Réservation mise à jour avec succès !");
      setIsSubmitted(true); // Désactivez le bouton de soumission

      // Réinitialiser les champs du formulaire
      setStartDate("");
      setPhone("");
      setEmail("");
      setName("");
      setPrenom("");
      setNumberOfGuests("");
      setComment("");
      setSelectedTimeSlot("");
      setOccStatus("");

      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        navigate(`/gir/${reservationId}`);
      }, 1);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.data?.error ||
          "Erreur lors de la mise à jour de la réservation. Veuillez réessayer."
      );
      setIsErrorModalOpen(true); // Ouvre le modal d'erreur
    }
  };

  const handleCancel = () => {
    navigate(`/gir/${reservationId}`); // Rediriger vers /gir/{reservationId} lorsqu'on clique sur Annuler
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="space-y-10 ">
        <SectionHeading title={"Modifier une réservation"} />
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            {isSubmitted ? (
              ""
            ) : (
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Informations du service Dîner
              </h2>
            )}
            <OccStatusDisplayClient status={occStatus} />
            {submitMessage && <ValidationMessage message={submitMessage} />}
            {reservationDetails && (
              <div>
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                  <p className="font-bold text-lg">
                    Modification réussie ! Voici les détails de la réservation :
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
                      {reservationDetails.client.name}
                    </li>
                    <li>
                      <span className="font-bold">Prénom :</span>{" "}
                      {reservationDetails.client.prenom}
                    </li>
                    <li>
                      <span className="font-bold">Téléphone :</span>{" "}
                      {reservationDetails.client.telephone}
                    </li>
                    <li>
                      <span className="font-bold">Email :</span>{" "}
                      {reservationDetails.client.email}
                    </li>
                    <li>
                      <span className="font-bold">Commentaire :</span>{" "}
                      {reservationDetails.comment}
                    </li>
                  </ul>
                  <div className="mt-2 text-sm text-gray-500">
                    Redirection automatique dans {countdown} secondes...
                  </div>
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
                  selected={startDate ? new Date(startDate) : null}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  showYearDropdown
                  scrollableMonthYearDropdown
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                {errors.date && (
                  <div style={{ color: "red" }}>{errors.date}</div>
                )}
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
                      readOnly
                      className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 read-only"
                    />
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
                      readOnly
                      autoComplete="family-name"
                      className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 read-only"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <TimeSlotSelector
                    date={startDate}
                    selectedTimeSlot={selectedTimeSlot}
                    onTimeSlotChange={handleTimeSlotChange}
                    setOccStatus={setOccStatus}
                    required
                    className="editable"
                  />
                  {errors.timeSlot && (
                    <div style={{ color: "red" }}>{errors.timeSlot}</div>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Numéro de téléphone
                  </label>
                  <div className="mt-2">
                    <PhoneInput
                      defaultCountry="FR"
                      value={phone}
                      onChange={setPhone}
                      readOnly
                      className="custom-phone-input read-only"
                    />
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
                      readOnly
                      className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 read-only"
                    />
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
                      className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 editable"
                    />
                    {errors.numberOfGuests && (
                      <div style={{ color: "red" }}>
                        {errors.numberOfGuests}
                      </div>
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 editable"
                    />
                    {errors.comment && (
                      <div style={{ color: "red" }}>{errors.comment}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={handleCancel} // Appeler la fonction handleCancel
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isSubmitted} // Désactivez le bouton après soumission
              >
                Enregistrer
              </button>
            </div>
          </form>
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
}