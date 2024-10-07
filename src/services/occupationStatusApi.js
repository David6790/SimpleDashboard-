import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const occupationStatusApi = createApi({
  reducerPath: "occupationStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["OccupationStatus"],
  endpoints: (builder) => ({
    getOccupationStatuses: builder.query({
      query: () => "OccupationStatus",
      keepUnusedDataFor: 1440,
      providesTags: ["OccupationStatus"],
    }),
    getOccupationStatusByDate: builder.query({
      query: (date) => `OccupationStatus/ByDate/${date}`, // API call to get status by date
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
      query: ({ id, occStatusMidi, occStatusDiner }) => ({
        url: `OccupationStatus/${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          occStatusMidi, // Ce champ correspond à newOccStatusDTO.OccStatusMidi
          occStatusDiner, // Ce champ correspond à newOccStatusDTO.OccStatusDiner
        }),
      }),
      invalidatesTags: ["OccupationStatus"],
    }),
  }),
});

export const {
  useGetOccupationStatusesQuery,
  useGetOccupationStatusByDateQuery, // Export the new hook
  usePostOccupationStatusMutation,
  useDeleteOccupationStatusMutation,
  useUpdateOccupationStatusMutation,
} = occupationStatusApi;
export default occupationStatusApi;
