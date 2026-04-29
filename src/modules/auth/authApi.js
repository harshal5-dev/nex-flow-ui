import { baseQuery } from "@/lib/utils";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setAuthError, setCredentials } from "./authSlice";

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

    isAuthenticated: builder.query({
      query: () => ({
        url: "/auth/is-authenticated",
        method: "GET",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("isAuthenticated - API response:", data);
          dispatch(setCredentials(data));
        } catch {
          dispatch(
            setAuthError("Session verification failed. Please sign in again.")
          );
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { emailId: email },
      }),
    }),

    signout: builder.mutation({
      query: () => ({
        url: "/auth/signout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useIsAuthenticatedQuery,
  useForgotPasswordMutation,
  useSignoutMutation,
} = authApi;
