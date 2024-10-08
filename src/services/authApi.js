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
      invalidatesTags: ["Users"], // Invalide le cache des utilisateurs après l'inscription
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
    // Nouvelle mutation pour modifier le rôle d'un utilisateur
    updateUserRole: builder.mutation({
      query: ({ email, newRole }) => ({
        url: `Auth/users/role`,
        method: "PUT",
        body: { email, newRole },
      }),
      invalidatesTags: ["Users"], // Invalide le cache des utilisateurs après la modification du rôle
    }),
    // Nouvelle mutation pour supprimer un utilisateur par email
    deleteUser: builder.mutation({
      query: (email) => ({
        url: `Auth/users/${email}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"], // Invalide le cache des utilisateurs après suppression
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetUsersQuery,
  useLogoutMutation,
  useUpdateUserRoleMutation, // Pour modifier le rôle
  useDeleteUserMutation, // Pour supprimer l'utilisateur
} = authApi;

export default authApi;
