import { useEffect, useState } from "react";

function TimeSlotSelector({
  date,
  selectedTimeSlot,
  onTimeSlotChange,
  setOccStatusLunch,
  setOccStatusDinner,
}) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (date) {
      // Remplacer l'URL par l'endpoint de votre API
      fetch(`${process.env.REACT_APP_API_URL}OccupationStatus/ByDate/${date}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Erreur lors de la récupération des créneaux horaires."
            );
          }
          return response.json();
        })
        .then((data) => {
          const { timeSlots: slots, occStatusMidi, occStatusDiner } = data;

          setTimeSlots(slots);
          setOccStatusLunch(occStatusMidi);
          setOccStatusDinner(occStatusDiner);
          setError(null); // Réinitialiser l'erreur en cas de succès
        })
        .catch((error) => {
          setError(error.message);
          setTimeSlots([]);
          setOccStatusLunch("");
          setOccStatusDinner("");
        });
    }
  }, [date, setOccStatusLunch, setOccStatusDinner]);

  if (error) {
    return <div>{error}</div>;
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
          {timeSlots
            ? timeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))
            : ""}
        </select>
      </div>
    </div>
  );
}

export default TimeSlotSelector;
