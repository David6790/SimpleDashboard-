import { useEffect, useState } from "react";
import axios from "axios";

function TimeSlotSelector({
  date,
  selectedTimeSlot,
  onTimeSlotChange,
  setOccStatus,
}) {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchTimeSlots = async (date) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}OccupationStatus/ByDate/${date}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (response.data && response.data.timeSlots) {
          setTimeSlots(response.data.timeSlots);
          setOccStatus(response.data.occStatus); // Mettre à jour occStatus
        } else {
          console.error(
            "Expected timeSlots array but received:",
            response.data
          );
          setTimeSlots([]); // Reset to an empty array if the response is not as expected
          setOccStatus(""); // Reset occStatus if the response is not as expected
        }
      } catch (error) {
        if (error.response) {
          console.error("Failed to fetch time slots", error.response.data);
        } else if (error.request) {
          console.error("No response received", error.request);
        } else {
          console.error("Error", error.message);
        }
        setTimeSlots([]); // Reset to an empty array in case of an error
        setOccStatus(""); // Reset occStatus in case of an error
      }
    };

    if (date) {
      fetchTimeSlots(date);
    }
    // eslint-disable-next-line
  }, [date]);

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
