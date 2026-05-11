import { baseQuery } from "@/lib/utils";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setAuthError, setCredentials } from "../reducer/authSlice";

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

    getUserProfile: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
      transformResponse: (response) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          dispatch(
            setAuthError("Session verification failed. Please sign in again.")
          );
        }
      },
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/auth/update",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Auth"],
    }),

    updateOrganization: builder.mutation({
      query: (orgData) => ({
        url: "/tenants",
        method: "PUT",
        body: orgData,
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation({
      query: ({ emailId }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { emailId },
      }),
    }),

    verifyResetPassword: builder.mutation({
      query: (resetPasswordData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetPasswordData,
      }),
    }),

    acceptInvite: builder.mutation({
      query: ({ token, password }) => ({
        url: "/auth/accept-invitation",
        method: "POST",
        body: { token, password },
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
  useForgotPasswordMutation,
  useVerifyResetPasswordMutation,
  useAcceptInviteMutation,
  useSignoutMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUpdateOrganizationMutation,
} = authApi;
