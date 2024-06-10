// store.js
import { configureStore } from "@reduxjs/toolkit";
import { reservationsApi } from "./services/reservations";
import { authApi } from "./services/authApi"; // Import authApi
import userReducer from "./slices/userSlice"; // Import userSlice
import { occupationStatusApi } from "./services/occupationStatusApi";
import allocationsApi from "./services/allocationsApi";

export const store = configureStore({
  reducer: {
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [allocationsApi.reducerPath]: allocationsApi.reducer,
    [authApi.reducerPath]: authApi.reducer, // Ajouter le réducteur authApi
    [occupationStatusApi.reducerPath]: occupationStatusApi.reducer, // Ajouter le réducteur occupationStatusApi
    user: userReducer, // Ajouter le réducteur userSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      reservationsApi.middleware,
      authApi.middleware,
      occupationStatusApi.middleware,
      allocationsApi.middleware
    ),
});

export default store;
