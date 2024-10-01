import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["Reservations", "HECStatuts"], // Ajout de "HECStatuts" ici
  endpoints: (builder) => ({
    getReservations: builder.query({
      query: () => "Reservations",
      keepUnusedDataFor: 1440,
    }),
    getMenuDuJour: builder.query({
      query: () => "MenuDuJour",
    }),
    getReservationsByDate: builder.query({
      query: (date) => `Reservations/byDate/${date}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    getFuturReservations: builder.query({
      query: () => "Reservations/futur",
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    // Nouvelle méthode getReservationsByDateAndPeriod
    getReservationsByDateAndPeriod: builder.query({
      query: ({ date, period }) =>
        `Reservations/byDateAndPeriod?date=${date}&period=${period}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    createReservation: builder.mutation({
      query: (newReservation) => ({
        url: "Reservations",
        method: "POST",
        body: newReservation,
      }),
      invalidatesTags: ["Reservations", "HECStatuts"], // Invalider "HECStatuts"
    }),
    updateReservation: builder.mutation({
      query: ({ id, ...updatedReservation }) => ({
        url: `Reservations/${id}`,
        method: "PUT",
        body: updatedReservation,
      }),
      invalidatesTags: ["Reservations", "HECStatuts"], // Invalider "HECStatuts"
    }),
    validateReservation: builder.mutation({
      query: (id) => ({
        url: `Reservations/${id}/validate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"], // Invalider "HECStatuts"
    }),
    cancelReservation: builder.mutation({
      query: ({ id, user }) => ({
        url: `Reservations/${id}/cancel/${user}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"], // Invalider "HECStatuts"
    }),
    refuseReservation: builder.mutation({
      query: ({ id, user }) => ({
        url: `Reservations/${id}/refuse/${user}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"], // Invalider "HECStatuts"
    }),
    getReservationById: builder.query({
      query: (id) => `Reservations/${id}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    // Ajout de validateDoubleConfirmation
    validateDoubleConfirmation: builder.mutation({
      query: (id) => ({
        url: `Reservations/${id}/validateDoubleConfirmation`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"], // Invalider les deux tags
    }),

    getUntreatedReservations: builder.query({
      query: () => "Reservations/untreated", // Appel de la nouvelle route
      keepUnusedDataFor: 1440, // Conserve les données pour 1440 minutes (24 heures)
      providesTags: ["Reservations"], // Invalide automatiquement les réservations
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useGetMenuDuJourQuery,
  useGetReservationsByDateQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useValidateReservationMutation,
  useGetFuturReservationsQuery,
  useCancelReservationMutation,
  useRefuseReservationMutation,
  useGetReservationByIdQuery,
  useValidateDoubleConfirmationMutation,
  useGetUntreatedReservationsQuery,
  useGetReservationsByDateAndPeriodQuery, // Exportation du hook pour cette méthode
} = reservationsApi;

export default reservationsApi;
