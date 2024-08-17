import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const allocationsApi = createApi({
  reducerPath: "allocationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7268/api/" }),
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
  }),
});

export const {
  useGetAllocationsQuery,
  useCreateAllocationMutation,
  useDeleteAllocationsByReservationMutation,
} = allocationsApi;

export default allocationsApi;
