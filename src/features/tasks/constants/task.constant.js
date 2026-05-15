export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  ON_HOLD: "ON_HOLD",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
};

export const TASK_STATUS_ORDER = [
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.DONE,
  TASK_STATUS.CANCELLED,
  TASK_STATUS.ON_HOLD,
  TASK_STATUS.COMPLETED,
];

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: "Todo",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.DONE]: "Done",
  [TASK_STATUS.ON_HOLD]: "On Hold",
  [TASK_STATUS.COMPLETED]: "Completed",
  [TASK_STATUS.CANCELLED]: "Cancelled",
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: "Low",
  [TASK_PRIORITY.MEDIUM]: "Medium",
  [TASK_PRIORITY.HIGH]: "High",
  [TASK_PRIORITY.URGENT]: "Urgent",
};

export const TASK_STATUS_BADGE_STYLES = {
  [TASK_STATUS.TODO]: "border-muted-foreground/25 bg-muted/35 text-muted-foreground",
  [TASK_STATUS.IN_PROGRESS]: "border-info/25 bg-info/10 text-info",
  [TASK_STATUS.DONE]: "border-success/25 bg-success/10 text-success",
  [TASK_STATUS.ON_HOLD]: "border-warning/25 bg-warning/10 text-warning",
  [TASK_STATUS.COMPLETED]: "border-success/25 bg-success/10 text-success",
  [TASK_STATUS.CANCELLED]: "border-destructive/25 bg-destructive/10 text-destructive",
};

export const TASK_PRIORITY_BADGE_STYLES = {
  [TASK_PRIORITY.LOW]: "border-success/25 bg-success/10 text-success",
  [TASK_PRIORITY.MEDIUM]: "border-warning/25 bg-warning/10 text-warning",
  [TASK_PRIORITY.HIGH]: "border-destructive/20 bg-destructive/8 text-destructive",
  [TASK_PRIORITY.URGENT]: "border-destructive/30 bg-destructive/12 text-destructive",
};

export const normalizeTaskStatus = (status) => {
  if (!status) return TASK_STATUS.TODO;

  const normalized = String(status)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  if (normalized === "IN_REVIEW" || normalized === "REVIEW") {
    return TASK_STATUS.DONE;
  }

  return TASK_STATUS[normalized] || TASK_STATUS.TODO;
};

export const normalizeTaskPriority = (priority) => {
  if (!priority) return TASK_PRIORITY.MEDIUM;

  const normalized = String(priority)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  return TASK_PRIORITY[normalized] || TASK_PRIORITY.MEDIUM;
};
