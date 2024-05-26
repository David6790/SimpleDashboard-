import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const occupationStatusApi = createApi({
  reducerPath: "occupationStatusApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7268/api/" }),
  tagTypes: ["OccupationStatus"],
  endpoints: (builder) => ({
    getOccupationStatuses: builder.query({
      query: () => "OccupationStatus",
      keepUnusedDataFor: 1440,
      providesTags: ["OccupationStatus"],
    }),
    postOccupationStatus: builder.mutation({
      query: (newOccupationStatus) => ({
        url: "OccupationStatus",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: newOccupationStatus,
      }),
      invalidatesTags: ["OccupationStatus"],
    }),
    deleteOccupationStatus: builder.mutation({
      query: (id) => ({
        url: `OccupationStatus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OccupationStatus"],
    }),
    updateOccupationStatus: builder.mutation({
      query: ({ id, newOccStatus }) => ({
        url: `OccupationStatus/${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: `"${newOccStatus}"`, // Envelopper newOccStatus dans des guillemets
      }),
      invalidatesTags: ["OccupationStatus"],
    }),
  }),
});

export const {
  useGetOccupationStatusesQuery,
  usePostOccupationStatusMutation,
  useDeleteOccupationStatusMutation,
  useUpdateOccupationStatusMutation,
} = occupationStatusApi;
export default occupationStatusApi;
