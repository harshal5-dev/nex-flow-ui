import { authApi } from "@/modules/auth/authApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/modules/auth/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
