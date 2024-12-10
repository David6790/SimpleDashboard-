import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    createPaymentSession: builder.mutation({
      query: ({ reservationId, numberOfGuests }) => ({
        url: "Payment/create-session",
        method: "POST",
        params: { reservationId, numberOfGuests },
      }),
    }),
  }),
});

export const { useCreatePaymentSessionMutation } = paymentApi;

export default paymentApi;
