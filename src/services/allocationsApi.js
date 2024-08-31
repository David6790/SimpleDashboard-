import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const allocationsApi = createApi({
  reducerPath: "allocationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["Allocations"],
  endpoints: (builder) => ({
    getAllocations: builder.query({
      query: ({ date, period }) => `Allocations?date=${date}&period=${period}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Allocations"],
    }),

    createAllocation: builder.mutation({
      query: (newAllocation) => ({
        url: "Allocations/create",
        method: "POST",
        body: newAllocation,
      }),
      invalidatesTags: ["Allocations"],
    }),

    deleteAllocationsByReservation: builder.mutation({
      query: (reservationId) => ({
        url: `Allocations/deleteByReservation/${reservationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Allocations"],
    }),

    changeAllocation: builder.mutation({
      query: ({ reservationId, newTableIds, date, period }) => ({
        url: `Allocations/change`,
        method: "POST",
        body: {
          reservationId,
          newTableIds,
          date,
          period,
        },
      }),
      invalidatesTags: ["Allocations"],
    }),
  }),
});

export const {
  useGetAllocationsQuery,
  useCreateAllocationMutation,
  useDeleteAllocationsByReservationMutation,
  useChangeAllocationMutation, // Ajout du hook pour changeAllocation
} = allocationsApi;

export default allocationsApi;
