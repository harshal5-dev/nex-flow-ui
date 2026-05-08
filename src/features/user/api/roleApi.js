import { baseQuery } from "@/lib/utils";
import { createApi } from "@reduxjs/toolkit/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQuery,
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => "/roles",
      providesTags: ["Role"],
      transformResponse: (response) => response.data,
    }),

    getPermissions: builder.query({
      query: () => "/roles/permissions",
      providesTags: ["Role"],
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 3600,
    }),

    createRole: builder.mutation({
      query: (role) => ({
        url: "/roles",
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["Role"],
    }),

    updateRole: builder.mutation({
      query: ({ id, ...role }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: role,
      }),
      invalidatesTags: ["Role"],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
