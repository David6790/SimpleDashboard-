import { configureStore } from "@reduxjs/toolkit";
import { reservationsApi } from "./services/reservations";
import { authApi } from "./services/authApi"; // Import authApi
import userReducer from "./slices/userSlice"; // Import userSlice
import { occupationStatusApi } from "./services/occupationStatusApi";
import allocationsApi from "./services/allocationsApi";
import { hecApi } from "./services/hecApi"; // Import hecApi
import { commentaireApi } from "./services/commentaireApi"; // Import commentaireApi
import { toggleApi } from "./services/toggleApi"; // Import toggleApi
import { procomApi } from "./services/procomApi";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [allocationsApi.reducerPath]: allocationsApi.reducer,
    [authApi.reducerPath]: authApi.reducer, // Ajouter le réducteur authApi
    [occupationStatusApi.reducerPath]: occupationStatusApi.reducer, // Ajouter le réducteur occupationStatusApi
    [hecApi.reducerPath]: hecApi.reducer, // Ajouter le réducteur hecApi
    [commentaireApi.reducerPath]: commentaireApi.reducer, // Ajouter le réducteur commentaireApi
    [toggleApi.reducerPath]: toggleApi.reducer, // Ajouter le réducteur toggleApi
    user: userReducer, // Ajouter le réducteur userSlice
    notification: notificationReducer,
    [procomApi.reducerPath]: procomApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      reservationsApi.middleware,
      authApi.middleware,
      occupationStatusApi.middleware,
      allocationsApi.middleware,
      hecApi.middleware, // Ajouter le middleware hecApi
      commentaireApi.middleware, // Ajouter le middleware commentaireApi
      toggleApi.middleware, // Ajouter le middleware toggleApi
      procomApi.middleware
    ),
});

export default store;
