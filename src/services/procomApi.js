import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const procomApi = createApi({
  reducerPath: "procomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["Procoms"],
  endpoints: (builder) => ({
    getAllProcoms: builder.query({
      query: () => "Procom", // Endpoint pour récupérer tous les PROCOMs
      keepUnusedDataFor: 1440, // Cache pendant 24 heures
      providesTags: ["Procoms"], // Tag utilisé pour invalider le cache
    }),
    getProcomDetails: builder.query({
      query: (reservationId) => `Procom/details?reservationId=${reservationId}`, // Endpoint pour récupérer un PROCOM détaillé
      providesTags: (result, error, arg) => [{ type: "Procoms", id: arg }], // Associer un tag unique basé sur l'ID de réservation
    }),
    createProcom: builder.mutation({
      query: (newProcom) => ({
        url: "Procom", // Endpoint pour créer un PROCOM
        method: "POST",
        body: newProcom, // Le corps de la requête
      }),
      invalidatesTags: ["Procoms"], // Invalide le cache après création
    }),
    createPropositionMenu: builder.mutation({
      query: (newMenu) => ({
        url: "Procom/create-proposition-menu", // Endpoint pour créer une proposition de menu
        method: "POST",
        body: newMenu, // Corps de la requête (CreatePropositionMenuDTO attendu)
      }),
      invalidatesTags: ["Procoms"], // Invalide les PROCOMs associés après modification
    }),
  }),
});

export const {
  useGetAllProcomsQuery, // Hook pour récupérer tous les PROCOMs
  useGetProcomDetailsQuery, // Hook pour récupérer un PROCOM détaillé par ID de réservation
  useCreateProcomMutation, // Hook pour créer un PROCOM
  useCreatePropositionMenuMutation, // Hook pour créer une proposition de menu
} = procomApi;

export default procomApi;
