import { configureStore } from "@reduxjs/toolkit";

import { roleApi, userApi } from "@/features/user";
import { authApi, authReducer } from "@/features/auth";
import { projectApi } from "@/features/project";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      roleApi.middleware,
      userApi.middleware,
      projectApi.middleware
    ),
});

export default store;
