import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7268/api/" }),
  tagTypes: ["Reservations"],
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
    createReservation: builder.mutation({
      query: (newReservation) => ({
        url: "Reservations",
        method: "POST",
        body: newReservation,
      }),
      invalidatesTags: ["Reservations"],
    }),
    updateReservation: builder.mutation({
      query: ({ id, ...updatedReservation }) => ({
        url: `Reservations/${id}`,
        method: "PUT",
        body: updatedReservation,
      }),
      invalidatesTags: ["Reservations"],
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useGetMenuDuJourQuery,
  useGetReservationsByDateQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation, // Ajoutez ceci pour utiliser le hook de mise à jour
} = reservationsApi;
export default reservationsApi;
