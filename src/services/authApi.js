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
  tagTypes: ["Users"], // Ajout des tags pour invalidation
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
        url: "Auth/signup", // Endpoint pour l'inscription
        method: "POST",
        body: newUser,
      }),
    }),
    getUsers: builder.query({
      query: () => "Auth/users", // Endpoint pour obtenir la liste des utilisateurs
      providesTags: ["Users"], // Utilisation des tags pour le caching et invalidation
    }),
    logout: builder.mutation({
      queryFn: () => {
        // Supprime le cookie contenant le token lors de la déconnexion
        Cookies.remove("token");
        return { data: null }; // Retourne une réponse vide après le logout
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetUsersQuery,
  useLogoutMutation,
} = authApi;
export default authApi;
