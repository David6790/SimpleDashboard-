import { useEffect, useState } from "react";
import { useGetOccupationStatusByDateQuery } from "../services/occupationStatusApi";

function TimeSlotSelector({
  date,
  selectedTimeSlot,
  onTimeSlotChange,
  setOccStatusLunch, // Met à jour le statut du déjeuner
  setOccStatusDinner, // Met à jour le statut du dîner
}) {
  const [timeSlots, setTimeSlots] = useState([]);

  // Utiliser le hook Redux Toolkit Query pour récupérer les statuts par date
  const { data, error } = useGetOccupationStatusByDateQuery(date, {
    skip: !date, // Ne pas exécuter tant que la date n'est pas définie
  });

  useEffect(() => {
    if (data) {
      const { timeSlots: slots, occStatusMidi, occStatusDiner } = data;

      setTimeSlots(slots); // Mettre à jour les créneaux horaires
      setOccStatusLunch(occStatusMidi); // Mettre à jour le statut du midi
      setOccStatusDinner(occStatusDiner); // Mettre à jour le statut du dîner
    } else {
      setTimeSlots([]);
      setOccStatusLunch(""); // Réinitialiser si aucune donnée n'est trouvée
      setOccStatusDinner("");
    }
  }, [data, setOccStatusLunch, setOccStatusDinner]);

  if (error) {
    return <div>Erreur lors de la récupération des créneaux horaires.</div>;
  }

  return (
    <div className="sm:col-span-4">
      <label
        htmlFor="timeSlot"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Sélectionnez un créneau horaire
      </label>
      <div className="mt-2">
        <select
          id="timeSlot"
          name="timeSlot"
          value={selectedTimeSlot}
          onChange={onTimeSlotChange}
          className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="">Sélectionnez un créneau</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TimeSlotSelector;
