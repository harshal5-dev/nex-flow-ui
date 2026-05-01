import { authApi } from "@/features/auth/api/authApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
