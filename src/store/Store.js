import { authApi } from "@/api/authApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
