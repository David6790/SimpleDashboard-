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
    // Tu peux ajouter d'autres endpoints pour les allocations ici plus tard
  }),
});

export const { useGetAllocationsQuery, useCreateAllocationMutation } =
  allocationsApi;

export default allocationsApi;
