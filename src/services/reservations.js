import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
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
    getFuturReservations: builder.query({
      query: () => "Reservations/futur",
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
    validateReservation: builder.mutation({
      query: (id) => ({
        url: `Reservations/${id}/validate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations"],
    }),
    cancelReservation: builder.mutation({
      query: ({ id, user }) => ({
        url: `Reservations/${id}/cancel/${user}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations"],
    }),
    refuseReservation: builder.mutation({
      query: ({ id, user }) => ({
        url: `Reservations/${id}/refuse/${user}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations"],
    }),
    getReservationById: builder.query({
      query: (id) => `Reservations/${id}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
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
} = reservationsApi;
export default reservationsApi;
