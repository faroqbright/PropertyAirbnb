import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/authSlice";

// Persist configuration for auth
const authPersistConfig = {
  key: "auth",
  storage,
};

// Creating persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = {
  auth: persistedAuthReducer,
  // Add other reducers here if needed
};

// Configuring store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore persist actions
      },
    }),
});

// Create persistor for Redux Persist
export const persistor = persistStore(store);
