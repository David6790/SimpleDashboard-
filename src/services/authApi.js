import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "Auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (newUser) => ({
        url: "Auth/signup", // Assuming this is the correct endpoint for signup
        method: "POST",
        body: newUser,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
export default authApi;
