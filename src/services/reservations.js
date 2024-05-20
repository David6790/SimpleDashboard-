// services/reservations.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7268/api/" }),
  endpoints: (builder) => ({
    getReservations: builder.query({
      query: () => "Reservations",
      keepUnusedDataFor: 1440,
    }),
    getMenuDuJour: builder.query({
      query: () => "MenuDuJour", // Correspond à l'URI de votre nouvelle route API
    }),
    getReservationsByDate: builder.query({
      query: (date) => `Reservations/byDate/${date}`,
      keepUnusedDataFor: 1440,
    }),
  }),
});

// Export des hooks pour utilisation dans vos composants
export const {
  useGetReservationsQuery,
  useGetMenuDuJourQuery,
  useGetReservationsByDateQuery,
} = reservationsApi;
export default reservationsApi;
