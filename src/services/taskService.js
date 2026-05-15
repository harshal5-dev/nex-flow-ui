const API_BASE_URL = "http://localhost:8081/api/v1";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed.");
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload?.data ?? payload;
};

export const taskService = {
  async getProjectTasks(projectId) {
    return request(`/projects/${projectId}/tasks`);
  },

  async createProjectTask(projectId, payload) {
    return request(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateTask(taskId, payload) {
    return request(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async deleteTask(taskId) {
    return request(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  },
};

export default taskService;
