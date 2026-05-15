import { baseQuery } from "@/lib/utils";
import { createApi } from "@reduxjs/toolkit/query/react";

const mapListTags = (items = [], type, listId = "LIST") => [
  { type, id: listId },
  ...items
    .map((item) => item?._id || item?.id)
    .filter(Boolean)
    .map((id) => ({ type, id })),
];

const mapTaskListTags = (items = [], projectId) => [
  { type: "Task", id: `PROJECT_${projectId}` },
  ...items
    .map((item) => item?._id || item?.id)
    .filter(Boolean)
    .map((id) => ({ type: "Task", id })),
];

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: baseQuery,
  tagTypes: ["Project", "Task"],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: (result = []) => mapListTags(result, "Project"),
      transformResponse: (response) => response.data,
    }),

    getProjectById: builder.query({
      query: (projectId) => `/projects/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
      ],
      transformResponse: (response) => response.data,
    }),

    getProjectTasks: builder.query({
      query: (projectId) => `/projects/${projectId}/tasks`,
      providesTags: (result = [], error, projectId) =>
        mapTaskListTags(result, projectId),
      transformResponse: (response) => response.data,
    }),

    createProjectTask: builder.mutation({
      query: ({ projectId, ...task }) => ({
        url: `/projects/${projectId}/tasks`,
        method: "POST",
        body: task,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Task", id: `PROJECT_${projectId}` },
        { type: "Project", id: projectId },
      ],
    }),

    updateTask: builder.mutation({
      query: ({ taskId, ...task }) => ({
        url: `/tasks/${taskId}`,
        method: "PATCH",
        body: task,
      }),
      invalidatesTags: (result, error, { taskId, projectId }) => [
        { type: "Task", id: taskId },
        ...(projectId ? [{ type: "Task", id: `PROJECT_${projectId}` }] : []),
        ...(projectId ? [{ type: "Project", id: projectId }] : []),
      ],
    }),

    deleteTask: builder.mutation({
      query: (arg) => {
        const taskId = typeof arg === "string" ? arg : arg?.taskId;

        return {
          url: `/tasks/${taskId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => {
        const taskId = typeof arg === "string" ? arg : arg?.taskId;
        const projectId = typeof arg === "object" ? arg?.projectId : undefined;

        return [
          ...(taskId ? [{ type: "Task", id: taskId }] : []),
          ...(projectId ? [{ type: "Task", id: `PROJECT_${projectId}` }] : []),
          ...(projectId ? [{ type: "Project", id: projectId }] : []),
        ];
      },
    }),

    getProjectStats: builder.query({
      query: () => "/projects/states",
      providesTags: [{ type: "Project", id: "LIST" }],
      transformResponse: (response) => response.data,
    }),

    getTeamStates: builder.query({
      query: () => "/users/team-states",
      providesTags: [{ type: "Project", id: "LIST" }],
      transformResponse: (response) => response.data,
    }),

    createProject: builder.mutation({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    getLookupUsers: builder.query({
      query: () => "/projects/lookup-users",
      providesTags: [{ type: "Project", id: "LOOKUP_USERS" }],
      transformResponse: (response) => response.data,
    }),

    updateProject: builder.mutation({
      query: ({ _id, ...project }) => ({
        url: `/projects/${_id}`,
        method: "PUT",
        body: project,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: _id },
      ],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id },
      ],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectTasksQuery,
  useCreateProjectTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTeamStatesQuery,
  useGetLookupUsersQuery,
  useGetProjectStatsQuery,
} = projectApi;
