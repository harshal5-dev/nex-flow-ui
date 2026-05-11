import { configureStore } from "@reduxjs/toolkit";

import { roleApi, userApi } from "@/features/user";
import { authApi, authReducer } from "@/features/auth";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      roleApi.middleware,
      userApi.middleware
    ),
});

export default store;
