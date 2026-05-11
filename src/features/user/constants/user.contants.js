export const ROLE_COLORS = [
  {
    icon: "text-primary",
    bg: "border-primary/20 bg-primary/10 dark:bg-primary/75 dark:border-primary/25 dark:text-foreground",
  },
  {
    icon: "text-info",
    bg: "border-info/20 bg-info/10 dark:bg-info/75 dark:border-info/25 dark:text-foreground",
  },
  {
    icon: "text-success",
    bg: "border-success/20 bg-success/10 dark:bg-success/75 dark:border-success/25 dark:text-foreground",
  },
  {
    icon: "text-destructive",
    bg: "border-destructive/20 bg-destructive/10 dark:bg-destructive/75 dark:border-destructive/25 dark:text-foreground",
  },
  {
    icon: "text-warning",
    bg: "border-warning/20 bg-warning/10 dark:bg-warning/75 dark:border-warning/25 dark:text-foreground",
  },
  {
    icon: "text-pending",
    bg: "border-pending/20 bg-pending/10 dark:bg-pending/75 dark:border-pending/25 dark:text-foreground",
  },
];

export const PERMISSION_STYLES = {
  // Tenant management
  UPDATE_TENANT: "bg-primary/10 text-primary",

  // User management
  MANAGE_USERS: "bg-info/10 text-info",
  VIEW_USERS: "bg-info/10 text-info",
  DELETE_USERS: "bg-info/10 text-info",
  CREATE_USERS: "bg-info/10 text-info",
  UPDATE_USERS: "bg-info/10 text-info",
  VIEW_LIST_USERS: "bg-info/10 text-info",

  // Role management
  MANAGE_ROLES: "bg-warning/10 text-warning",
  VIEW_ROLES: "bg-warning/10 text-warning",
  DELETE_ROLES: "bg-warning/10 text-warning",
  CREATE_ROLES: "bg-warning/10 text-warning",
  UPDATE_ROLES: "bg-warning/10 text-warning",
  VIEW_LIST_ROLES: "bg-warning/10 text-warning",

  // Task management
  MANAGE_TASKS: "bg-success/10 text-success",
  VIEW_TASKS: "bg-success/10 text-success",
  DELETE_TASKS: "bg-success/10 text-success",
  CREATE_TASKS: "bg-success/10 text-success",
  UPDATE_TASKS: "bg-success/10 text-success",
  VIEW_LIST_TASKS: "bg-success/10 text-success",

  // Project management
  MANAGE_PROJECTS: "bg-pending/10 text-pending",
  VIEW_PROJECTS: "bg-pending/10 text-pending",
  DELETE_PROJECTS: "bg-pending/10 text-pending",
  CREATE_PROJECTS: "bg-pending/10 text-pending",
  UPDATE_PROJECTS: "bg-pending/10 text-pending",
  VIEW_LIST_PROJECTS: "bg-pending/10 text-pending",
};

export const PERMISSION_LABELS = {
  UPDATE_TENANT: "Update Tenant",

  MANAGE_USERS: "Manage Users",
  VIEW_USERS: "View Users",
  DELETE_USERS: "Delete Users",
  CREATE_USERS: "Create Users",
  UPDATE_USERS: "Update Users",
  VIEW_LIST_USERS: "View List Users",

  MANAGE_ROLES: "Manage Roles",
  VIEW_ROLES: "View Roles",
  DELETE_ROLES: "Delete Roles",
  CREATE_ROLES: "Create Roles",
  UPDATE_ROLES: "Update Roles",
  VIEW_LIST_ROLES: "View List Roles",

  MANAGE_TASKS: "Manage Tasks",
  VIEW_TASKS: "View Tasks",
  DELETE_TASKS: "Delete Tasks",
  CREATE_TASKS: "Create Tasks",
  UPDATE_TASKS: "Update Tasks",
  VIEW_LIST_TASKS: "View List Tasks",

  MANAGE_PROJECTS: "Manage Projects",
  VIEW_PROJECTS: "View Projects",
  DELETE_PROJECTS: "Delete Projects",
  CREATE_PROJECTS: "Create Projects",
  UPDATE_PROJECTS: "Update Projects",
  VIEW_LIST_PROJECTS: "View List Projects",
};

export const STAT_COLORS = [
  { color: "text-info", bg: "border-info/20 bg-info/8" },
  { color: "text-primary", bg: "border-primary/20 bg-primary/8" },
  { color: "text-success", bg: "border-success/20 bg-success/8" },
  { color: "text-warning", bg: "border-warning/20 bg-warning/8" },
];
