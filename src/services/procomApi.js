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
    createProcom: builder.mutation({
      query: (newProcom) => ({
        url: "Procom", // Endpoint pour créer un PROCOM
        method: "POST",
        body: newProcom, // Le corps de la requête
      }),
      invalidatesTags: ["Procoms"], // Invalide le cache après création
    }),
  }),
});

export const {
  useGetAllProcomsQuery, // Hook pour récupérer tous les PROCOMs
  useCreateProcomMutation, // Hook pour créer un PROCOM
} = procomApi;

export default procomApi;
