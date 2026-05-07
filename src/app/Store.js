import { configureStore } from "@reduxjs/toolkit";

import { roleApi } from "@/features/user";
import { authApi, authReducer } from "@/features/auth";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [roleApi.reducerPath]: roleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, roleApi.middleware),
});

export default store;
