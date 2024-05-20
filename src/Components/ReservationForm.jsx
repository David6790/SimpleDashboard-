import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "react-phone-number-input/style.css"; // Importer seulement le style de base
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import TimeSlotSelector from "./TimeSlotSelector";

import {
  validateEmail,
  validateNumberOfPeople,
  validateDate,
} from "./ValidationSaisie";
import OccStatusDisplay from "./OccStatusDisplay";

export default function ReservationForm() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [occStatus, setOccStatus] = useState("");

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
    const { value } = event.target; // Récupération de la valeur depuis l'événement
    setEmail(value);
    const error = validateEmail(value)
      ? ""
      : "L'adresse email n'est pas valide.";
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handleNumberOfGuestsChange = (event) => {
    const number = event.target.value; // Récupération de la valeur depuis l'événement
    setNumberOfGuests(number);
    const error = validateNumberOfPeople(number)
      ? ""
      : "Le nombre de personnes doit être un entier positif et non nul.";
    setErrors((prev) => ({ ...prev, numberOfGuests: error }));
  };

  const handleChange = (value) => {
    setPhone(value);
    if (value && !isValidPhoneNumber(value)) {
      setErrors((errors) => ({
        ...errors,
        phone: "Le numéro de téléphone n'est pas valide.",
      }));
    } else {
      setErrors((errors) => ({ ...errors, phone: null }));
    }
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
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Informations du service Dîner
          </h2>

          <OccStatusDisplay status={occStatus} />
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="col-span-full mb-5">
              <h1 className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Sélectionnez la date de la réservation
              </h1>
              <DatePicker
                selected={new Date(startDate)}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()} // Définir une date minimum (optionnel)
                showYearDropdown // Montrer le menu déroulant des années (optionnel)
                scrollableMonthYearDropdown
                className="block w-full px-3 py-2 mt-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    autoComplete="family-name"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <TimeSlotSelector
                date={startDate}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotChange={handleTimeSlotChange}
                setOccStatus={setOccStatus} // Passer la fonction de mise à jour
              />

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
                    onChange={handleChange}
                    className="custom-phone-input"
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
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
