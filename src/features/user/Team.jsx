import { useEffect, useMemo, useState } from "react";
import {
  IconActivity,
  IconBolt,
  IconChecklist,
  IconClockHour4,
  IconEdit,
  IconLayoutGrid,
  IconMail,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconTable,
  IconTrash,
  IconUserPlus,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_ROLES = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Full workspace access and management permissions.",
    permissions: ["manage_users", "manage_roles", "view_reports"],
  },
  {
    id: "role-manager",
    name: "Manager",
    description: "Owns delivery planning and cross-team coordination.",
    permissions: ["assign_tasks", "view_reports", "manage_projects"],
  },
  {
    id: "role-developer",
    name: "Developer",
    description: "Builds product features and resolves sprint tasks.",
    permissions: ["update_tasks", "view_projects"],
  },
  {
    id: "role-designer",
    name: "Designer",
    description: "Creates product UI and contributes design updates.",
    permissions: ["view_projects", "comment_tasks"],
  },
];

const INITIAL_USERS = [
  {
    id: "user-1",
    name: "Shraddha Harshal",
    email: "shraddha@nexflow.com",
    roleId: "role-admin",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: "user-2",
    name: "Ananya Sharma",
    email: "ananya@nexflow.com",
    roleId: "role-manager",
    status: "Busy",
    lastActive: "8 min ago",
  },
  {
    id: "user-3",
    name: "Rahul Patil",
    email: "rahul@nexflow.com",
    roleId: "role-developer",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "user-4",
    name: "Nina Mehta",
    email: "nina@nexflow.com",
    roleId: "role-designer",
    status: "Offline",
    lastActive: "41 min ago",
  },
];

// ─── Style Constants ───────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Active:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Busy: "border-amber-500/30  bg-amber-500/10  text-amber-600  dark:text-amber-400",
  Offline: "border-border/60     bg-muted/50       text-muted-foreground",
};

const STATUS_DOT = {
  Active: "bg-emerald-500 shadow-emerald-500/60 shadow-[0_0_6px_1px]",
  Busy: "bg-amber-500",
  Offline: "bg-muted-foreground/40",
};

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-violet-600",
  "from-lime-500 to-green-600",
];

const ROLE_COLORS = [
  {
    icon: "text-violet-500",
    bg: "border-violet-500/20 bg-violet-500/10",
    ring: "ring-violet-500/20",
  },
  {
    icon: "text-blue-500",
    bg: "border-blue-500/20   bg-blue-500/10",
    ring: "ring-blue-500/20",
  },
  {
    icon: "text-emerald-500",
    bg: "border-emerald-500/20 bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  {
    icon: "text-rose-500",
    bg: "border-rose-500/20   bg-rose-500/10",
    ring: "ring-rose-500/20",
  },
  {
    icon: "text-amber-500",
    bg: "border-amber-500/20  bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  {
    icon: "text-sky-500",
    bg: "border-sky-500/20    bg-sky-500/10",
    ring: "ring-sky-500/20",
  },
];

const PERMISSION_STYLES = {
  manage_users:
    "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  manage_roles:
    "border-purple-500/25 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  view_reports:
    "border-blue-500/25   bg-blue-500/10   text-blue-600   dark:text-blue-400",
  assign_tasks:
    "border-amber-500/25  bg-amber-500/10  text-amber-600  dark:text-amber-400",
  manage_projects:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  update_tasks:
    "border-cyan-500/25   bg-cyan-500/10   text-cyan-600   dark:text-cyan-400",
  view_projects:
    "border-sky-500/25    bg-sky-500/10    text-sky-600    dark:text-sky-400",
  comment_tasks:
    "border-rose-500/25   bg-rose-500/10   text-rose-600   dark:text-rose-400",
};

const STAT_COLORS = [
  { color: "text-blue-500", bg: "border-blue-500/20    bg-blue-500/8" },
  { color: "text-violet-500", bg: "border-violet-500/20  bg-violet-500/8" },
  { color: "text-emerald-500", bg: "border-emerald-500/20 bg-emerald-500/8" },
  { color: "text-amber-500", bg: "border-amber-500/20   bg-amber-500/8" },
];

const SELECT_CLS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

const TEXTAREA_CLS =
  "min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarGradient(name) {
  const code = (name?.charCodeAt(0) ?? 0) + (name?.charCodeAt(1) ?? 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

function getPermissionStyle(permission) {
  return (
    PERMISSION_STYLES[permission] ??
    "border-border/50 bg-muted/50 text-muted-foreground"
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UserAvatar({ name, size = "md", className }) {
  const gradient = getAvatarGradient(name);
  const sizeClass = {
    sm: "size-7 text-[10px]",
    md: "size-9 text-sm",
    lg: "size-11 text-base",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br font-semibold text-white",
        gradient,
        sizeClass,
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
}

function StatusDot({ status }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        STATUS_DOT[status] ?? STATUS_DOT.Offline
      )}
    />
  );
}

function PermissionChip({ permission }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
        getPermissionStyle(permission)
      )}
    >
      {permission}
    </span>
  );
}

function ManagementModal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  children,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative w-full max-w-xl animate-in overflow-hidden rounded-2xl border-border/50 bg-card/95 p-0 shadow-2xl backdrop-blur-xl duration-200 zoom-in-95 fade-in">
        {/* Gradient accent line */}
        <div className="h-1 bg-linear-to-r from-primary/40 via-primary to-primary/40" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 -right-12 size-52 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {Icon && (
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <Icon className="size-4.5 text-primary" />
                </span>
              )}
              <div>
                <p className="font-semibold tracking-tight">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-lg"
              onClick={onClose}
            >
              <IconX className="size-4" />
            </Button>
          </div>

          <div className="mt-5 border-t border-border/40 pt-5">{children}</div>
        </div>
      </Card>
    </div>
  );
}

function TableHeadLabel({ Icon, label, align = "left" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        align === "right" && "w-full justify-end"
      )}
    >
      <Icon className="size-3.5 text-muted-foreground/70" />
      <span>{label}</span>
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <span className="inline-flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
        <IconSearch className="size-4.5 text-muted-foreground/60" />
      </span>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/60">
        Try adjusting your search query
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Team() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [userView, setUserView] = useState("table");
  const [roleView, setRoleView] = useState("table");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [userError, setUserError] = useState("");
  const [roleError, setRoleError] = useState("");

  const [userForm, setUserForm] = useState({
    id: "",
    name: "",
    email: "",
    roleId: INITIAL_ROLES[0]?.id ?? "",
    status: "Active",
  });

  const [roleForm, setRoleForm] = useState({
    id: "",
    name: "",
    description: "",
    permissions: "",
  });

  // ── Derived data ─────────────────────────────────────────────────────────

  const roleById = useMemo(
    () =>
      roles.reduce((acc, r) => {
        acc[r.id] = r;
        return acc;
      }, {}),
    [roles]
  );

  const roleColorByIndex = useMemo(
    () =>
      roles.reduce((acc, r, i) => {
        acc[r.id] = ROLE_COLORS[i % ROLE_COLORS.length];
        return acc;
      }, {}),
    [roles]
  );

  const membersByRoleId = useMemo(
    () =>
      users.reduce((acc, u) => {
        if (u.roleId) {
          acc[u.roleId] = [...(acc[u.roleId] ?? []), u];
        }
        return acc;
      }, {}),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, roleById[u.roleId]?.name ?? "Unassigned", u.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [users, searchQuery, roleById]);

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) =>
      [
        r.name,
        r.description,
        r.permissions.join(" "),
        String(membersByRoleId[r.id]?.length ?? 0),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [roles, searchQuery, membersByRoleId]);

  const statCards = useMemo(() => {
    const activeCount = users.filter((u) => u.status === "Active").length;
    const unassigned = users.filter((u) => !u.roleId).length;
    return [
      {
        label: "Total Users",
        value: users.length,
        note: "Workspace members",
        Icon: IconUsers,
      },
      {
        label: "Total Roles",
        value: roles.length,
        note: "Permission groups",
        Icon: IconShieldCheck,
      },
      {
        label: "Active Now",
        value: activeCount,
        note: "Currently available",
        Icon: IconActivity,
      },
      {
        label: "Unassigned",
        value: unassigned,
        note: "Members without a role",
        Icon: IconBolt,
      },
    ];
  }, [users, roles]);

  const activeView = activeTab === "users" ? userView : roleView;

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isUserModalOpen && !isRoleModalOpen) return undefined;
    const handler = (e) => {
      if (e.key === "Escape") {
        setIsUserModalOpen(false);
        setIsRoleModalOpen(false);
        setUserError("");
        setRoleError("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isUserModalOpen, isRoleModalOpen]);

  // ── Form helpers ──────────────────────────────────────────────────────────

  const clearUserForm = () => {
    setUserForm({
      id: "",
      name: "",
      email: "",
      roleId: roles[0]?.id ?? "",
      status: "Active",
    });
    setUserError("");
  };

  const clearRoleForm = () => {
    setRoleForm({ id: "", name: "", description: "", permissions: "" });
    setRoleError("");
  };

  const openCreateUserModal = () => {
    clearUserForm();
    setIsUserModalOpen(true);
  };
  const openCreateRoleModal = () => {
    clearRoleForm();
    setIsRoleModalOpen(true);
  };
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    clearUserForm();
  };
  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    clearRoleForm();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setIsUserModalOpen(false);
    setIsRoleModalOpen(false);
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const name = userForm.name.trim();
    const email = userForm.email.trim();
    if (!name || !email) {
      setUserError("Name and email are required.");
      return;
    }
    setUserError("");
    const roleId = roles.some((r) => r.id === userForm.roleId)
      ? userForm.roleId
      : "";
    const payload = {
      name,
      email: email.toLowerCase(),
      roleId,
      status: userForm.status,
      lastActive: "Just now",
    };
    if (userForm.id) {
      setUsers((cur) =>
        cur.map((u) => (u.id === userForm.id ? { ...u, ...payload } : u))
      );
    } else {
      setUsers((cur) => [{ id: createId("user"), ...payload }, ...cur]);
    }
    setIsUserModalOpen(false);
    clearUserForm();
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    const name = roleForm.name.trim();
    const description = roleForm.description.trim();
    const permissions = roleForm.permissions
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .filter(Boolean);
    if (!name || !description || permissions.length === 0) {
      setRoleError(
        "Name, description, and at least one permission are required."
      );
      return;
    }
    setRoleError("");
    const payload = { name, description, permissions };
    if (roleForm.id) {
      setRoles((cur) =>
        cur.map((r) => (r.id === roleForm.id ? { ...r, ...payload } : r))
      );
    } else {
      setRoles((cur) => [{ id: createId("role"), ...payload }, ...cur]);
    }
    setIsRoleModalOpen(false);
    clearRoleForm();
  };

  const beginUserEdit = (user) => {
    setUserForm({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      status: user.status,
    });
    setUserError("");
    setIsUserModalOpen(true);
  };

  const beginRoleEdit = (role) => {
    setRoleForm({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.join(", "),
    });
    setRoleError("");
    setIsRoleModalOpen(true);
  };

  const removeUser = (userId) => {
    setUsers((cur) => cur.filter((u) => u.id !== userId));
    if (userForm.id === userId) clearUserForm();
  };

  const removeRole = (roleId) => {
    setRoles((cur) => cur.filter((r) => r.id !== roleId));
    setUsers((cur) =>
      cur.map((u) =>
        u.roleId === roleId ? { ...u, roleId: "", lastActive: "Just now" } : u
      )
    );
    if (roleForm.id === roleId) {
      setIsRoleModalOpen(false);
      clearRoleForm();
    }
    if (userForm.roleId === roleId)
      setUserForm((cur) => ({ ...cur, roleId: "" }));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="grid gap-5">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -right-10 size-60 rounded-full bg-primary/6 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <IconSparkles className="size-5 text-primary" />
            </span>
            <div>
              <h1 className="text-base font-semibold tracking-tight">
                Team Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage users, roles, permissions, and access flow
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="inline-flex rounded-xl border border-border/60 bg-background/70 p-1 backdrop-blur">
            <Button
              type="button"
              size="sm"
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="gap-1.5 rounded-lg px-3.5"
              onClick={() => handleTabChange("users")}
            >
              <IconUsers className="size-3.5" />
              Users
              <span className="ml-0.5 rounded-full border border-border/60 bg-muted px-1.5 py-0 text-[10px] font-medium text-muted-foreground">
                {users.length}
              </span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeTab === "roles" ? "secondary" : "ghost"}
              className="gap-1.5 rounded-lg px-3.5"
              onClick={() => handleTabChange("roles")}
            >
              <IconShieldCheck className="size-3.5" />
              Roles
              <span className="ml-0.5 rounded-full border border-border/60 bg-muted px-1.5 py-0 text-[10px] font-medium text-muted-foreground">
                {roles.length}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
          <Card
            key={item.label}
            className="group relative animate-in overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Subtle ambient at icon color */}
            <div
              className="pointer-events-none absolute -top-8 -right-6 size-32 rounded-full opacity-30 blur-2xl"
              style={{ background: `var(--tw-gradient-from, transparent)` }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />

            <div className="flex items-start justify-between gap-3 p-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums">
                  {String(item.value)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {item.note}
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
                  STAT_COLORS[index]?.bg ?? "border-primary/20 bg-primary/10"
                )}
              >
                <item.Icon
                  className={cn(
                    "size-5",
                    STAT_COLORS[index]?.color ?? "text-primary"
                  )}
                />
              </span>
            </div>
          </Card>
        ))}
      </section>

      {/* ── Directory Section ─────────────────────────────────────────────── */}
      <section>
        <Card className="rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 p-4 md:p-5">
            <div>
              <p className="text-sm font-semibold tracking-tight">
                {activeTab === "users" ? "Users Directory" : "Roles Directory"}
              </p>
              <p className="text-xs text-muted-foreground">
                {activeTab === "users"
                  ? "Browse and update workspace members"
                  : "Browse and update role definitions"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* View toggle */}
              <div className="inline-flex rounded-lg border border-border/70 bg-background p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={activeView === "table" ? "secondary" : "ghost"}
                  className="px-2"
                  onClick={() =>
                    activeTab === "users"
                      ? setUserView("table")
                      : setRoleView("table")
                  }
                  aria-label="Table view"
                >
                  <IconTable className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={activeView === "grid" ? "secondary" : "ghost"}
                  className="px-2"
                  onClick={() =>
                    activeTab === "users"
                      ? setUserView("grid")
                      : setRoleView("grid")
                  }
                  aria-label="Grid view"
                >
                  <IconLayoutGrid className="size-4" />
                </Button>
              </div>

              {/* Add button */}
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={
                  activeTab === "users"
                    ? openCreateUserModal
                    : openCreateRoleModal
                }
              >
                <IconPlus className="size-4" />
                {activeTab === "users" ? "Add User" : "Add Role"}
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative border-b border-border/40 px-4 py-3 md:px-5">
            <IconSearch className="pointer-events-none absolute top-1/2 left-7 size-3.5 -translate-y-1/2 text-muted-foreground/70 md:left-8" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "users"
                  ? "Search by name, email, role, or status…"
                  : "Search by role name, permission, or member count…"
              }
              className="h-9 rounded-lg bg-background/70 pl-8 text-sm"
            />
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            {/* ════ USERS ════ */}
            {activeTab === "users" ? (
              activeView === "table" ? (
                /* Users — Table */
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full min-w-160 text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/30 text-xs text-muted-foreground">
                        <th className="px-4 py-3 text-left font-medium">
                          <TableHeadLabel Icon={IconUsers} label="Member" />
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          <TableHeadLabel Icon={IconShieldCheck} label="Role" />
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          <TableHeadLabel Icon={IconChecklist} label="Status" />
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          <TableHeadLabel
                            Icon={IconClockHour4}
                            label="Last Active"
                          />
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          <TableHeadLabel
                            Icon={IconEdit}
                            label="Actions"
                            align="right"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredUsers.length ? (
                        filteredUsers.map((user) => {
                          const role = roleById[user.roleId];
                          const roleColor = roleColorByIndex[user.roleId];
                          return (
                            <tr
                              key={user.id}
                              className="group/row transition-colors duration-150 hover:bg-muted/20"
                            >
                              {/* Member */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <UserAvatar name={user.name} size="md" />
                                  <div>
                                    <p className="leading-tight font-medium">
                                      {user.name}
                                    </p>
                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <IconMail className="size-3" />
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Role */}
                              <td className="px-4 py-3">
                                {role ? (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "gap-1 rounded-full border px-2.5 text-[11px] font-medium",
                                      roleColor?.bg ??
                                        "border-border/50 bg-muted/30"
                                    )}
                                  >
                                    <IconShieldCheck
                                      className={cn(
                                        "size-3",
                                        roleColor?.icon ??
                                          "text-muted-foreground"
                                      )}
                                    />
                                    {role.name}
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="rounded-full border-border/50 text-[11px] text-muted-foreground"
                                  >
                                    Unassigned
                                  </Badge>
                                )}
                              </td>

                              {/* Status */}
                              <td className="px-4 py-3">
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                                    STATUS_STYLES[user.status]
                                  )}
                                >
                                  <StatusDot status={user.status} />
                                  {user.status}
                                </span>
                              </td>

                              {/* Last Active */}
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <IconClockHour4 className="size-3.5" />
                                  {user.lastActive}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    className="opacity-0 transition-opacity group-hover/row:opacity-100"
                                    onClick={() => beginUserEdit(user)}
                                    aria-label={`Edit ${user.name}`}
                                  >
                                    <IconEdit className="size-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    className="text-destructive opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-destructive"
                                    onClick={() => removeUser(user.id)}
                                    aria-label={`Delete ${user.name}`}
                                  >
                                    <IconTrash className="size-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <EmptyState message="No users match your search" />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Users — Grid */
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredUsers.length ? (
                    filteredUsers.map((user) => {
                      const role = roleById[user.roleId];
                      const roleColor = roleColorByIndex[user.roleId];
                      const gradient = getAvatarGradient(user.name);
                      return (
                        <div
                          key={user.id}
                          className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                        >
                          {/* Gradient banner */}
                          <div
                            className={cn(
                              "relative h-20 bg-linear-to-br",
                              gradient
                            )}
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18)_0%,transparent_60%)]" />
                            {/* Status chip */}
                            <span
                              className={cn(
                                "absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-sm",
                                STATUS_STYLES[user.status]
                              )}
                            >
                              <StatusDot status={user.status} />
                              {user.status}
                            </span>
                          </div>

                          {/* Body */}
                          <div className="flex flex-1 flex-col gap-0 px-4 pb-4">
                            {/* Avatar overlapping banner */}
                            <div className="-mt-5.5 mb-2.5">
                              <UserAvatar
                                name={user.name}
                                size="lg"
                                className="ring-3 ring-card"
                              />
                            </div>

                            <p className="leading-tight font-semibold">
                              {user.name}
                            </p>
                            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <IconMail className="size-3 shrink-0" />
                              {user.email}
                            </p>

                            {/* Meta row */}
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              {role ? (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "gap-1 rounded-full border px-2.5 text-[11px] font-medium",
                                    roleColor?.bg ??
                                      "border-border/50 bg-muted/30"
                                  )}
                                >
                                  <IconShieldCheck
                                    className={cn(
                                      "size-3",
                                      roleColor?.icon ?? "text-muted-foreground"
                                    )}
                                  />
                                  {role.name}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-border/50 text-[11px] text-muted-foreground"
                                >
                                  Unassigned
                                </Badge>
                              )}
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <IconClockHour4 className="size-3" />
                                {user.lastActive}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="mt-3.5 flex gap-1.5">
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                className="flex-1 gap-1"
                                onClick={() => beginUserEdit(user)}
                              >
                                <IconEdit className="size-3.5" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeUser(user.id)}
                                aria-label="Delete user"
                              >
                                <IconTrash className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full">
                      <EmptyState message="No users match your search" />
                    </div>
                  )}
                </div>
              )
            ) : /* ════ ROLES ════ */
            activeView === "table" ? (
              /* Roles — Table */
              <div className="overflow-x-auto rounded-xl border border-border/50">
                <table className="w-full min-w-170 text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30 text-xs text-muted-foreground">
                      <th className="px-4 py-3 text-left font-medium">
                        <TableHeadLabel Icon={IconShieldCheck} label="Role" />
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        <TableHeadLabel
                          Icon={IconChecklist}
                          label="Description"
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        <TableHeadLabel
                          Icon={IconSparkles}
                          label="Permissions"
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        <TableHeadLabel Icon={IconUsers} label="Members" />
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        <TableHeadLabel
                          Icon={IconEdit}
                          label="Actions"
                          align="right"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredRoles.length ? (
                      filteredRoles.map((role) => {
                        const roleColor =
                          ROLE_COLORS[roles.indexOf(role) % ROLE_COLORS.length];
                        const members = membersByRoleId[role.id] ?? [];
                        return (
                          <tr
                            key={role.id}
                            className="group/row transition-colors duration-150 hover:bg-muted/20"
                          >
                            {/* Role name */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={cn(
                                    "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border",
                                    roleColor?.bg ??
                                      "border-border/50 bg-muted/30"
                                  )}
                                >
                                  <IconShieldCheck
                                    className={cn(
                                      "size-3.5",
                                      roleColor?.icon ?? "text-muted-foreground"
                                    )}
                                  />
                                </span>
                                <span className="font-medium">{role.name}</span>
                              </div>
                            </td>

                            {/* Description */}
                            <td className="max-w-56 px-4 py-3.5 text-xs text-muted-foreground">
                              {role.description}
                            </td>

                            {/* Permissions */}
                            <td className="py-3. 5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 2).map((p) => (
                                  <PermissionChip key={p} permission={p} />
                                ))}
                                {role.permissions.length > 2 && (
                                  <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                                    +{role.permissions.length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Members */}
                            <td className="px-4 py-3.5">
                              {members.length > 0 ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-2">
                                    {members.slice(0, 3).map((m) => (
                                      <UserAvatar
                                        key={m.id}
                                        name={m.name}
                                        size="sm"
                                        className="ring-2 ring-card"
                                      />
                                    ))}
                                    {members.length > 3 && (
                                      <span className="inline-flex size-7 items-center justify-center rounded-full border border-border/50 bg-muted text-[10px] font-medium ring-2 ring-card">
                                        +{members.length - 3}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {members.length}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground/60">
                                  No members
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5">
                              <div className="flex justify-end gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="opacity-0 transition-opacity group-hover/row:opacity-100"
                                  onClick={() => beginRoleEdit(role)}
                                  aria-label={`Edit ${role.name}`}
                                >
                                  <IconEdit className="size-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="text-destructive opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-destructive"
                                  onClick={() => removeRole(role.id)}
                                  aria-label={`Delete ${role.name}`}
                                >
                                  <IconTrash className="size-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <EmptyState message="No roles match your search" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Roles — Grid */
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRoles.length ? (
                  filteredRoles.map((role) => {
                    const roleColor =
                      ROLE_COLORS[roles.indexOf(role) % ROLE_COLORS.length];
                    const members = membersByRoleId[role.id] ?? [];
                    return (
                      <div
                        key={role.id}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                      >
                        {/* Ambient glow in role color */}
                        <div className="pointer-events-none absolute -top-8 -right-8 size-28 rounded-full opacity-20 blur-2xl" />

                        {/* Header row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border",
                                roleColor?.bg ?? "border-border/50 bg-muted/30"
                              )}
                            >
                              <IconShieldCheck
                                className={cn(
                                  "size-5",
                                  roleColor?.icon ?? "text-muted-foreground"
                                )}
                              />
                            </span>
                            <div>
                              <p className="leading-tight font-semibold">
                                {role.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {members.length} member
                                {members.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => beginRoleEdit(role)}
                              aria-label={`Edit ${role.name}`}
                            >
                              <IconEdit className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeRole(role.id)}
                              aria-label={`Delete ${role.name}`}
                            >
                              <IconTrash className="size-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          {role.description}
                        </p>

                        {/* Permissions */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {role.permissions.map((p) => (
                            <PermissionChip key={p} permission={p} />
                          ))}
                        </div>

                        {/* Member avatars */}
                        {members.length > 0 && (
                          <div className="mt-3.5 flex items-center gap-2 border-t border-border/30 pt-3.5">
                            <div className="flex -space-x-2">
                              {members.slice(0, 4).map((m) => (
                                <UserAvatar
                                  key={m.id}
                                  name={m.name}
                                  size="sm"
                                  className="ring-2 ring-card"
                                />
                              ))}
                              {members.length > 4 && (
                                <span className="inline-flex size-7 items-center justify-center rounded-full border border-border/50 bg-muted text-[10px] font-medium ring-2 ring-card">
                                  +{members.length - 4}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {members
                                .map((m) => m.name.split(" ")[0])
                                .slice(0, 2)
                                .join(", ")}
                              {members.length > 2
                                ? ` & ${members.length - 2} more`
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full">
                    <EmptyState message="No roles match your search" />
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* ── User Modal ───────────────────────────────────────────────────── */}
      <ManagementModal
        open={isUserModalOpen}
        onClose={closeUserModal}
        icon={IconUserPlus}
        title={userForm.id ? "Edit Member" : "Add Member"}
        description={
          userForm.id
            ? "Update this member's information and role"
            : "Invite a new member and assign them to a role"
        }
      >
        <form className="space-y-4" onSubmit={handleUserSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-name" className="text-xs font-medium">
                Full Name
              </Label>
              <Input
                id="user-name"
                value={userForm.name}
                onChange={(e) =>
                  setUserForm((c) => ({ ...c, name: e.target.value }))
                }
                placeholder="Enter full name"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-email" className="text-xs font-medium">
                Email Address
              </Label>
              <Input
                id="user-email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm((c) => ({ ...c, email: e.target.value }))
                }
                placeholder="name@company.com"
                className="h-9"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-role" className="text-xs font-medium">
                Role
              </Label>
              <select
                id="user-role"
                value={userForm.roleId}
                onChange={(e) =>
                  setUserForm((c) => ({ ...c, roleId: e.target.value }))
                }
                className={SELECT_CLS}
              >
                <option value="">Unassigned</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-status" className="text-xs font-medium">
                Status
              </Label>
              <select
                id="user-status"
                value={userForm.status}
                onChange={(e) =>
                  setUserForm((c) => ({ ...c, status: e.target.value }))
                }
                className={SELECT_CLS}
              >
                <option value="Active">Active</option>
                <option value="Busy">Busy</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          {userError && (
            <p className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-2 text-xs font-medium text-destructive">
              <IconX className="size-3.5 shrink-0" />
              {userError}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1">
              {userForm.id ? "Update Member" : "Add Member"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={closeUserModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ManagementModal>

      {/* ── Role Modal ───────────────────────────────────────────────────── */}
      <ManagementModal
        open={isRoleModalOpen}
        onClose={closeRoleModal}
        icon={IconShieldCheck}
        title={roleForm.id ? "Edit Role" : "Create Role"}
        description="Define role permissions and team ownership levels"
      >
        <form className="space-y-4" onSubmit={handleRoleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="role-name" className="text-xs font-medium">
              Role Name
            </Label>
            <Input
              id="role-name"
              value={roleForm.name}
              onChange={(e) =>
                setRoleForm((c) => ({ ...c, name: e.target.value }))
              }
              placeholder="e.g. QA Lead"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-description" className="text-xs font-medium">
              Description
            </Label>
            <textarea
              id="role-description"
              value={roleForm.description}
              onChange={(e) =>
                setRoleForm((c) => ({ ...c, description: e.target.value }))
              }
              placeholder="Describe the responsibilities for this role"
              className={TEXTAREA_CLS}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-permissions" className="text-xs font-medium">
              Permissions
            </Label>
            <Input
              id="role-permissions"
              value={roleForm.permissions}
              onChange={(e) =>
                setRoleForm((c) => ({ ...c, permissions: e.target.value }))
              }
              placeholder="manage_users, view_reports, assign_tasks"
              className="h-9"
            />
            <p className="text-[11px] text-muted-foreground">
              Separate multiple permissions with commas.
            </p>
          </div>

          {roleError && (
            <p className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-2 text-xs font-medium text-destructive">
              <IconX className="size-3.5 shrink-0" />
              {roleError}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1">
              {roleForm.id ? "Update Role" : "Create Role"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={closeRoleModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ManagementModal>
    </main>
  );
}

export default Team;
