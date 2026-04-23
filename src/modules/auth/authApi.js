import { baseQuery } from "@/lib/utils";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (signupData) => ({
        url: "/auth/signup",
        method: "POST",
        body: signupData,
      }),
    }),

    signin: builder.mutation({
      query: (signinData) => ({
        url: "/auth/signin",
        method: "POST",
        body: signinData,
      }),
    }),
  }),
});

export const { useSignupMutation, useSigninMutation } = authApi;
