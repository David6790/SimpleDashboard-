import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hecApi = createApi({
  reducerPath: "hecApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["HECStatuts"],
  endpoints: (builder) => ({
    // Récupérer tous les statuts liés à une réservation
    getHECStatutsByReservationId: builder.query({
      query: (reservationId) => `HEC/statuts/${reservationId}`,
      keepUnusedDataFor: 1440,
      providesTags: ["HECStatuts"],
    }),

    // Ajouter un nouveau statut HEC
    addHECStatut: builder.mutation({
      query: (newHECStatut) => ({
        url: "HECStatuts",
        method: "POST",
        body: newHECStatut,
      }),
      invalidatesTags: ["HECStatuts"],
    }),
  }),
});

export const {
  useGetHECStatutsByReservationIdQuery, // Hook pour récupérer les statuts par réservation
  useAddHECStatutMutation, // Hook pour ajouter un statut HEC
} = hecApi;

export default hecApi;
