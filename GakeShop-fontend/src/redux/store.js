import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import gakeReducer from "./gakeSlice";

// Cấu hình redux-persist
const persistConfig = {
  key: "gake",
  version: 1,
  storage,
 whitelist: ["userInfo"], // ✅ Không include products
};

// Tạo reducer có persist
const persistedReducer = persistReducer(persistConfig, gakeReducer);

// Store chính
export const store = configureStore({
  reducer: {
    gakeReducer: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export persistor
export const persistor = persistStore(store);
