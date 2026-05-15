import {
  TASK_PRIORITY,
  TASK_STATUS,
  TASK_STATUS_ORDER,
  normalizeTaskPriority,
  normalizeTaskStatus,
} from "@/features/tasks/constants/task.constant";

export const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.name ||
  user?.emailId ||
  "User";

export const normalizeUser = (user) => {
  if (!user) return null;

  return {
    _id: user?._id || user?.id,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    emailId: user?.emailId || "",
  };
};

export const normalizeProject = (project) => {
  if (!project) return null;

  const members = Array.isArray(project.assignees)
    ? project.assignees.map(normalizeUser).filter(Boolean)
    : Array.isArray(project.members)
      ? project.members.map(normalizeUser).filter(Boolean)
      : [];

  return {
    _id: project._id || project.id,
    name: project.name || "Untitled Project",
    description: project.description || "",
    status: project.status || "IN_PROGRESS",
    dueDate: project.dueDate || "",
    createdAt: project.createdAt || "",
    updatedAt: project.updatedAt || "",
    members,
    taskCount: project.taskCount,
    assigneeCount: project.assigneeCount,
    tasks: Array.isArray(project.tasks) ? project.tasks : [],
  };
};

export const normalizeTask = (task, { membersById = {}, projectId } = {}) => {
  if (!task) return null;

  const rawAssignees =
    task.assignees || task.assignee || task.assigneeDetails || task.assignedTo;

  const assigneeList = Array.isArray(rawAssignees)
    ? rawAssignees
    : rawAssignees
      ? [rawAssignees]
      : [];

  const assignees = assigneeList
    .map((assignee) => {
      if (typeof assignee === "string") {
        return membersById[assignee] || { _id: assignee };
      }

      const id = assignee?._id || assignee?.id;
      if (!id) return null;

      return membersById[id] || normalizeUser(assignee);
    })
    .filter(Boolean);

  const createdBy = normalizeUser(task.createdBy) || null;

  return {
    _id: task._id || task.id,
    title: task.title || task.name || "Untitled Task",
    description: task.description || "",
    project: task.project || projectId,
    status: normalizeTaskStatus(task.status),
    priority: normalizeTaskPriority(task.priority),
    assignees,
    dueDate: task.dueDate || "",
    createdBy,
    createdAt: task.createdAt || "",
    updatedAt: task.updatedAt || "",
  };
};

export const formatDate = (dateValue, withTime = false) => {
  if (!dateValue) return "-";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
};

export const isOverdueTask = (task) => {
  if (!task?.dueDate || normalizeTaskStatus(task.status) === TASK_STATUS.COMPLETED) {
    return false;
  }

  const parsed = new Date(task.dueDate);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.getTime() < Date.now();
};

export const calculateTaskStats = (tasks = []) => {
  const normalized = tasks.filter(Boolean);
  const total = normalized.length;

  const counts = normalized.reduce(
    (acc, task) => {
      const status = normalizeTaskStatus(task.status);
      acc[status] += 1;

      if (isOverdueTask(task)) acc.overdue += 1;
      return acc;
    },
    {
      [TASK_STATUS.TODO]: 0,
      [TASK_STATUS.IN_PROGRESS]: 0,
      [TASK_STATUS.REVIEW]: 0,
      [TASK_STATUS.COMPLETED]: 0,
      [TASK_STATUS.CANCELLED]: 0,
      overdue: 0,
    }
  );

  const completed = counts[TASK_STATUS.COMPLETED];
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    todo: counts[TASK_STATUS.TODO],
    inProgress: counts[TASK_STATUS.IN_PROGRESS],
    review: counts[TASK_STATUS.REVIEW],
    completed,
    cancelled: counts[TASK_STATUS.CANCELLED],
    overdue: counts.overdue,
    progress,
  };
};

export const sortTasksByRecent = (tasks = []) => {
  return [...tasks].sort((a, b) => {
    const updatedA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const updatedB = new Date(b.updatedAt || b.createdAt || 0).getTime();

    return updatedB - updatedA;
  });
};

export const defaultTaskPayload = {
  title: "",
  description: "",
  status: TASK_STATUS.TODO,
  priority: TASK_PRIORITY.MEDIUM,
  assignees: [],
  dueDate: "",
};

export const TASK_COLUMNS = TASK_STATUS_ORDER;
