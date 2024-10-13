import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Création de l'API pour les commentaires
export const commentaireApi = createApi({
  reducerPath: "commentaireApi", // Nom du reducer
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL, // Base URL de l'API
  }),
  tagTypes: ["Commentaires"], // Pour gérer les tags dans le cache
  endpoints: (builder) => ({
    // Récupérer tous les commentaires liés à une réservation
    getCommentairesByReservationId: builder.query({
      query: (reservationId) => `Commentaire/commentaires/${reservationId}`, // Point de terminaison de l'API pour les commentaires
      keepUnusedDataFor: 1440, // Durée de mise en cache (en minutes)
      providesTags: ["Commentaires"], // Invalider le cache si nécessaire
    }),

    // Ajouter un nouveau commentaire avec l'option origin
    addCommentaire: builder.mutation({
      query: ({ newCommentaire, origin }) => ({
        url: `Commentaire/add-commentaire${origin ? `?origin=${origin}` : ""}`, // Ajout du paramètre origin si fourni
        method: "POST", // Méthode HTTP
        body: newCommentaire, // Corps de la requête
      }),
      invalidatesTags: ["Commentaires", "Reservations", "Toggle"], // Invalider le cache des commentaires pour rafraîchir la liste
    }),
  }),
});

// Export des hooks générés par RTK Query
export const {
  useGetCommentairesByReservationIdQuery, // Hook pour récupérer les commentaires par ID de réservation
  useAddCommentaireMutation, // Hook pour ajouter un nouveau commentaire avec origin
} = commentaireApi;

export default commentaireApi;
