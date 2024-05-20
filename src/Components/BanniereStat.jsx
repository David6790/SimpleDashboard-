import React from "react";

export default function BanniereStat({ reservations, selectedDate }) {
  const formattedDate = selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calcul des statistiques
  const totalGuests = reservations
    ? reservations.reduce(
        (acc, reservation) => acc + reservation.numberOfGuest,
        0
      )
    : 0;

  const totalGuestsMidi = reservations
    ? reservations
        .filter((reservation) => reservation.timeResa <= "14:00")
        .reduce((acc, reservation) => acc + reservation.numberOfGuest, 0)
    : 0;

  const totalGuestsSoir = reservations
    ? reservations
        .filter((reservation) => reservation.timeResa >= "19:00")
        .reduce((acc, reservation) => acc + reservation.numberOfGuest, 0)
    : 0;

  return (
    <div className="mt-5 mx-8 mb-20">
      <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-10">
        {formattedDate.toUpperCase()}
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Nombre de couverts à midi
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {totalGuestsMidi}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Nombre de couverts le soir
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {totalGuestsSoir}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Nombre de couverts la journée
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {totalGuests}
          </dd>
        </div>
      </dl>
    </div>
  );
}
