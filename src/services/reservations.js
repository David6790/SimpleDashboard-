import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ["Reservations", "HECStatuts"],
  endpoints: (builder) => ({
    getReservations: builder.query({
      query: () => "Reservations",
      keepUnusedDataFor: 1440,
    }),
    getMenuDuJour: builder.query({
      query: () => "MenuDuJour",
    }),
    getReservationsByDate: builder.query({
      query: (date) => `Reservations/byDate/${date}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    getFuturReservations: builder.query({
      query: () => "Reservations/futur",
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    getReservationsByDateAndPeriod: builder.query({
      query: ({ date, period }) =>
        `Reservations/byDateAndPeriod?date=${date}&period=${period}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    getReservationsWithClientComments: builder.query({
      query: () => "Reservations/client-comments",
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    createReservation: builder.mutation({
      query: (newReservation) => ({
        url: "Reservations",
        method: "POST",
        body: newReservation,
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    updateReservation: builder.mutation({
      query: ({ id, ...updatedReservation }) => ({
        url: `Reservations/${id}`,
        method: "PUT",
        body: updatedReservation,
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    powerUpdateReservation: builder.mutation({
      query: ({ id, ...updatedReservation }) => ({
        url: `Reservations/PowerUser/${id}`,
        method: "PUT",
        body: updatedReservation,
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    validateReservation: builder.mutation({
      query: ({ id, isSms = false }) => ({
        url: `Reservations/${id}/validate?isSms=${isSms}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),

    cancelReservation: builder.mutation({
      query: ({ id, user }) => ({
        url: `Reservations/${id}/cancel/${user}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    refuseReservation: builder.mutation({
      query: ({ id, user }) => ({
        url: `Reservations/${id}/refuse/${user}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    getReservationById: builder.query({
      query: (id) => `Reservations/${id}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    validateDoubleConfirmation: builder.mutation({
      query: (id) => ({
        url: `Reservations/${id}/validateDoubleConfirmation`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    getUntreatedReservations: builder.query({
      query: () => "Reservations/untreated",
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    getModificationRequestByOriginalReservationId: builder.query({
      query: (originalReservationId) =>
        `Reservations/modification-request/${originalReservationId}`,
      keepUnusedDataFor: 1440,
      providesTags: ["Reservations"],
    }),
    validateModification: builder.mutation({
      query: (id) => ({
        url: `Reservations/${id}/validate-modification`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    // Nouvelle mutation pour refuser la modification
    refuseModification: builder.mutation({
      query: (id) => ({
        url: `Reservations/${id}/refuse-modification`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    // Nouvelle mutation pour annuler la réservation d'origine
    cancelModification: builder.mutation({
      query: (id) => ({
        url: `Reservations/${id}/cancel-modification`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    cancelNoShowReservation: builder.mutation({
      query: ({ id, user }) => ({
        url: `Reservations/${id}/cancel-noshow/${user}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),
    createSpontaneousReservation: builder.mutation({
      query: ({ date, period }) => ({
        url: "Reservations/spontaneous",
        method: "POST",
        body: { date, period }, // Envoi des paramètres au backend
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),

    setHasArrived: builder.mutation({
      query: ({ id, hasArrived }) => ({
        url: `Reservations/${id}/has-arrived?hasArrived=${hasArrived}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations"],
    }),

    setDepartClient: builder.mutation({
      query: (id) => ({
        url: `Reservations/depart/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Reservations", "Allocations"],
    }),

    powerUserCreateReservation: builder.mutation({
      query: (newReservation) => ({
        url: "Reservations/power-user",
        method: "POST",
        body: newReservation,
      }),
      invalidatesTags: ["Reservations", "HECStatuts"],
    }),

    lastMinuteChange: builder.mutation({
      query: ({ id, newGuestCount }) => ({
        url: `Reservations/${id}/last-minute-change?newGuestCount=${newGuestCount}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reservations"],
    }),

    addNoteInterne: builder.mutation({
      query: (noteInterne) => ({
        url: "Reservations/noteInternes/notes",
        method: "POST",
        body: noteInterne,
      }),
      invalidatesTags: ["Reservations", "NotesInternes"],
    }),

    // Endpoint pour récupérer les notes internes par ID de réservation
    getNotesInternesByReservationId: builder.query({
      query: (reservationId) => `Reservations/${reservationId}/noteInternes`,
      providesTags: ["NotesInternes"],
    }),

    deleteNoteInterne: builder.mutation({
      query: (noteId) => ({
        url: `Reservations/noteInternes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reservations", "NotesInternes"],
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useGetMenuDuJourQuery,
  useGetReservationsByDateQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useValidateReservationMutation,
  useGetFuturReservationsQuery,
  useCancelReservationMutation,
  useRefuseReservationMutation,
  useGetReservationByIdQuery,
  useValidateDoubleConfirmationMutation,
  useGetUntreatedReservationsQuery,
  useGetReservationsByDateAndPeriodQuery,
  useGetReservationsWithClientCommentsQuery,
  useGetModificationRequestByOriginalReservationIdQuery,
  useValidateModificationMutation, // Export du hook pour valider la modification
  useRefuseModificationMutation, // Export du hook pour refuser la modification
  useCancelModificationMutation, // Export du hook pour annuler la modification
  useCancelNoShowReservationMutation,
  useCreateSpontaneousReservationMutation,
  useSetHasArrivedMutation,
  useSetDepartClientMutation,
  usePowerUserCreateReservationMutation,
  usePowerUpdateReservationMutation,
  useLastMinuteChangeMutation,
  useAddNoteInterneMutation,
  useGetNotesInternesByReservationIdQuery,
  useDeleteNoteInterneMutation,
} = reservationsApi;

export default reservationsApi;
