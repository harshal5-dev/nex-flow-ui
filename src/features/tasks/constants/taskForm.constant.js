import { TASK_PRIORITY, TASK_STATUS } from "@/features/tasks/constants/task.constant";

export const taskFormDefaults = {
  title: "",
  description: "",
  status: TASK_STATUS.TODO,
  priority: TASK_PRIORITY.MEDIUM,
  assignees: [],
  dueDate: "",
};
