import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsExterneApi = createApi({
  reducerPath: "reservationsExterneApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL, // URL de l'API backend
  }),
  tagTypes: ["ReservationsExternes"], // Tags pour gérer le cache des réservations externes
  endpoints: (builder) => ({
    createExternalReservation: builder.mutation({
      query: (externalReservation) => ({
        url: "public/reservations/create", // URL corrigée pour correspondre au backend
        method: "POST",
        body: externalReservation, // Corps de la requête
      }),
      invalidatesTags: ["ReservationsExternes"], // Invalide le cache après création
    }),
    cancelExternalReservation: builder.mutation({
      query: ({ id, user, reason }) => ({
        url: `public/reservations/cancel/${id}?user=${user}&reason=${encodeURIComponent(
          reason || ""
        )}`, // URL de l'endpoint pour annuler une réservation
        method: "PATCH",
      }),
      invalidatesTags: ["ReservationsExternes"], // Invalide le cache après annulation
    }),
    modifyExternalReservation: builder.mutation({
      query: ({ id, ...updatedReservation }) => ({
        url: `public/reservations/modify/${id}`, // URL de l'endpoint pour modifier une réservation
        method: "PUT",
        body: updatedReservation, // Corps de la requête
      }),
      invalidatesTags: ["ReservationsExternes"], // Invalide le cache après modification
    }),
  }),
});

// Export des hooks
export const {
  useCreateExternalReservationMutation,
  useCancelExternalReservationMutation,
  useModifyExternalReservationMutation, // Nouveau hook pour modifier une réservation
} = reservationsExterneApi;

export default reservationsExterneApi;
