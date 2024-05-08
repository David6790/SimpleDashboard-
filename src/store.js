// store.js
import { configureStore } from "@reduxjs/toolkit";
import { reservationsApi } from "./services/reservations"; // Nous allons créer ce service ensuite

export const store = configureStore({
  reducer: {
    // Ajoutez les reducers de l'API ici
    [reservationsApi.reducerPath]: reservationsApi.reducer,
  },
  // Ajout du middleware nécessaire pour RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reservationsApi.middleware),
});
