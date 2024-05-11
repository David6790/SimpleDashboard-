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
  }),
});

// Export des hooks pour utilisation dans vos composants
export const { useGetReservationsQuery, useGetMenuDuJourQuery } =
  reservationsApi;
export default reservationsApi;
