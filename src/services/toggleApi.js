import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const toggleApi = createApi({
  reducerPath: "toggleApi", // Assurez-vous que le reducerPath est bien défini ici
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["Toggle"],
  endpoints: (builder) => ({
    getNotificationToggle: builder.query({
      query: () => "toggle/notification-status",
      providesTags: ["Toggle"],
    }),
    updateNotificationToggle: builder.mutation({
      query: (isActive) => ({
        url: "toggle/notification-status",
        method: "POST",
        body: { isActive },
      }),
      invalidatesTags: ["Toggle"],
    }),
  }),
});

export const {
  useGetNotificationToggleQuery,
  useUpdateNotificationToggleMutation,
} = toggleApi;
