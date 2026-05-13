import { baseQuery } from "@/lib/utils";
import { createApi } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: baseQuery,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Project"],
      transformResponse: (response) => response.data,
    }),

    getTeamStates: builder.query({
      query: () => "/users/team-states",
      providesTags: ["Project"],
      transformResponse: (response) => response.data,
    }),

    createProject: builder.mutation({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Project"],
    }),

    getLookupUsers: builder.query({
      query: () => "/projects/lookup-users",
      providesTags: ["Project"],
      transformResponse: (response) => response.data,
    }),

    updateProject: builder.mutation({
      query: ({ id, ...project }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: project,
      }),
      invalidatesTags: ["Project"],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useGetTeamStatesQuery,
  useGetLookupUsersQuery,
} = projectApi;
