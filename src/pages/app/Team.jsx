import { useEffect, useMemo, useState } from "react";
import {
  IconChecklist,
  IconClockHour4,
  IconEdit,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconTable,
  IconTrash,
  IconUserPlus,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

const statusStyles = {
  Active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  Busy: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  Offline: "border-slate-500/30 bg-slate-500/10 text-slate-600",
};

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

const textareaClassName =
  "min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function ManagementModal({ open, onClose, title, description, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-background/65 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative w-full max-w-xl animate-in rounded-xl border-border/70 bg-card p-4 shadow-2xl duration-500 zoom-in-95 fade-in md:p-5">
        <div className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
            >
              <IconX className="size-4" />
            </Button>
          </div>

          <div className="mt-4">{children}</div>
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
      <Icon className="size-3.5 text-muted-foreground/80" />
      <span>{label}</span>
    </span>
  );
}

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

  const roleById = useMemo(() => {
    return roles.reduce((accumulator, role) => {
      accumulator[role.id] = role;
      return accumulator;
    }, {});
  }, [roles]);

  const memberCountByRoleId = useMemo(() => {
    return users.reduce((accumulator, user) => {
      if (user.roleId) {
        accumulator[user.roleId] = (accumulator[user.roleId] ?? 0) + 1;
      }
      return accumulator;
    }, {});
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const roleName = roleById[user.roleId]?.name ?? "Unassigned";

      return [user.name, user.email, roleName, user.status]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [users, searchQuery, roleById]);

  const filteredRoles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return roles;
    }

    return roles.filter((role) => {
      const members = memberCountByRoleId[role.id] ?? 0;

      return [
        role.name,
        role.description,
        role.permissions.join(" "),
        String(members),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [roles, searchQuery, memberCountByRoleId]);

  const statCards = useMemo(() => {
    const activeUsers = users.filter((user) => user.status === "Active").length;
    const unassignedUsers = users.filter((user) => !user.roleId).length;

    return [
      {
        label: "Total Users",
        value: String(users.length),
        note: "Workspace members",
        Icon: IconUsers,
      },
      {
        label: "Total Roles",
        value: String(roles.length),
        note: "Permission groups",
        Icon: IconShieldCheck,
      },
      {
        label: "Active Users",
        value: String(activeUsers),
        note: "Currently available",
        Icon: IconUserPlus,
      },
      {
        label: "Unassigned",
        value: String(unassignedUsers),
        note: "Users without a role",
        Icon: IconSearch,
      },
    ];
  }, [users, roles]);

  const activeView = activeTab === "users" ? userView : roleView;

  useEffect(() => {
    if (!isUserModalOpen && !isRoleModalOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsUserModalOpen(false);
        setIsRoleModalOpen(false);
        setUserError("");
        setRoleError("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isUserModalOpen, isRoleModalOpen]);

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
    setRoleForm({
      id: "",
      name: "",
      description: "",
      permissions: "",
    });
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

  const handleUserSubmit = (event) => {
    event.preventDefault();

    const trimmedName = userForm.name.trim();
    const trimmedEmail = userForm.email.trim();

    if (!trimmedName || !trimmedEmail) {
      setUserError("Name and email are required.");
      return;
    }

    setUserError("");

    const selectedRoleId = roles.some((role) => role.id === userForm.roleId)
      ? userForm.roleId
      : "";

    const payload = {
      name: trimmedName,
      email: trimmedEmail.toLowerCase(),
      roleId: selectedRoleId,
      status: userForm.status,
      lastActive: "Just now",
    };

    if (userForm.id) {
      setUsers((current) =>
        current.map((user) =>
          user.id === userForm.id ? { ...user, ...payload } : user
        )
      );
    } else {
      setUsers((current) => [{ id: createId("user"), ...payload }, ...current]);
    }

    setIsUserModalOpen(false);
    clearUserForm();
  };

  const handleRoleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = roleForm.name.trim();
    const trimmedDescription = roleForm.description.trim();
    const parsedPermissions = roleForm.permissions
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    if (!trimmedName || !trimmedDescription || parsedPermissions.length === 0) {
      setRoleError(
        "Name, description, and at least one permission are required."
      );
      return;
    }

    setRoleError("");

    const payload = {
      name: trimmedName,
      description: trimmedDescription,
      permissions: parsedPermissions,
    };

    if (roleForm.id) {
      setRoles((current) =>
        current.map((role) =>
          role.id === roleForm.id ? { ...role, ...payload } : role
        )
      );
    } else {
      setRoles((current) => [{ id: createId("role"), ...payload }, ...current]);
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
    setUsers((current) => current.filter((user) => user.id !== userId));

    if (userForm.id === userId) {
      clearUserForm();
    }
  };

  const removeRole = (roleId) => {
    setRoles((current) => current.filter((role) => role.id !== roleId));
    setUsers((current) =>
      current.map((user) =>
        user.roleId === roleId
          ? { ...user, roleId: "", lastActive: "Just now" }
          : user
      )
    );

    if (roleForm.id === roleId) {
      setIsRoleModalOpen(false);
      clearRoleForm();
    }

    if (userForm.roleId === roleId) {
      setUserForm((current) => ({ ...current, roleId: "" }));
    }
  };

  return (
    <main className="grid gap-4">
      <section className="relative overflow-hidden rounded-xl border border-border/70 bg-card/70 p-4 md:p-5">
        <div className="pointer-events-none absolute -top-12 -right-4 size-44 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Team Management</p>
            <p className="text-xs text-muted-foreground">
              Manage users, roles, permissions, and access flow with a cleaner,
              modal-first workflow
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-border/70 bg-background/80 p-1">
            <Button
              type="button"
              size="sm"
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="px-3"
              onClick={() => handleTabChange("users")}
            >
              <IconUsers className="size-4" />
              Users
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeTab === "roles" ? "secondary" : "ghost"}
              className="px-3"
              onClick={() => handleTabChange("roles")}
            >
              <IconShieldCheck className="size-4" />
              Roles
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
          <article
            key={item.label}
            className="animate-in rounded-md border border-border/70 bg-background/75 p-4 duration-700 fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${60 + index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.note}
                </p>
              </div>
              <span className="rounded-md border border-primary/25 bg-primary/10 p-2 text-primary">
                <item.Icon className="size-4" />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        <section className="rounded-md border border-border/70 bg-background/70 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">
                {activeTab === "users" ? "Users Directory" : "Roles Directory"}
              </p>
              <p className="text-xs text-muted-foreground">
                {activeTab === "users"
                  ? "Browse and update workspace members"
                  : "Browse and update role definitions"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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

              <Button
                type="button"
                size="sm"
                onClick={
                  activeTab === "users"
                    ? openCreateUserModal
                    : openCreateRoleModal
                }
              >
                <IconPlus className="size-4" />
                {activeTab === "users" ? "Create User" : "Create Role"}
              </Button>
            </div>
          </div>

          <div className="relative mt-3">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={
                activeTab === "users"
                  ? "Search by name, email, role, status..."
                  : "Search by role name, permission, member count..."
              }
              className="h-9 rounded-lg bg-background pl-9"
            />
          </div>

          {activeTab === "users" ? (
            activeView === "table" ? (
              <div className="mt-3 overflow-x-auto rounded-md border border-border/70">
                <table className="w-full min-w-170 text-sm">
                  <thead className="bg-muted/35 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">
                        <TableHeadLabel Icon={IconUsers} label="User" />
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        <TableHeadLabel Icon={IconShieldCheck} label="Role" />
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        <TableHeadLabel Icon={IconChecklist} label="Status" />
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        <TableHeadLabel
                          Icon={IconClockHour4}
                          label="Last Active"
                        />
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        <TableHeadLabel
                          Icon={IconEdit}
                          label="Actions"
                          align="right"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-border/70 transition-colors hover:bg-muted/30"
                        >
                          <td className="px-3 py-2.5">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="rounded-sm border border-border/70 bg-background px-2 py-0.5 text-xs">
                              {roleById[user.roleId]?.name ?? "Unassigned"}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={cn(
                                "rounded-sm border px-2 py-0.5 text-xs font-medium",
                                statusStyles[user.status]
                              )}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground">
                            {user.lastActive}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => beginUserEdit(user)}
                                aria-label={`Edit ${user.name}`}
                              >
                                <IconEdit className="size-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeUser(user.id)}
                                aria-label={`Delete ${user.name}`}
                              >
                                <IconTrash className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-8 text-center text-xs text-muted-foreground"
                        >
                          No users found for your current search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-md border border-border/70 bg-background/90 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-sm border px-2 py-0.5 text-[10px] font-medium",
                            statusStyles[user.status]
                          )}
                        >
                          {user.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                        <span className="rounded-sm border border-border/70 bg-card px-2 py-0.5">
                          {roleById[user.roleId]?.name ?? "Unassigned"}
                        </span>
                        <span className="rounded-sm border border-border/70 bg-card px-2 py-0.5 text-muted-foreground">
                          {user.lastActive}
                        </span>
                      </div>

                      <div className="mt-2.5 flex gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          className="flex-1"
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
                        >
                          <IconTrash className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full py-8 text-center text-xs text-muted-foreground">
                    No users found for your current search.
                  </p>
                )}
              </div>
            )
          ) : activeView === "table" ? (
            <div className="mt-3 overflow-x-auto rounded-md border border-border/70">
              <table className="w-full min-w-175 text-sm">
                <thead className="bg-muted/35 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">
                      <TableHeadLabel Icon={IconShieldCheck} label="Role" />
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      <TableHeadLabel
                        Icon={IconChecklist}
                        label="Description"
                      />
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      <TableHeadLabel
                        Icon={IconShieldCheck}
                        label="Permissions"
                      />
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      <TableHeadLabel Icon={IconUsers} label="Members" />
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      <TableHeadLabel
                        Icon={IconEdit}
                        label="Actions"
                        align="right"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length ? (
                    filteredRoles.map((role) => (
                      <tr
                        key={role.id}
                        className="border-t border-border/70 transition-colors hover:bg-muted/30"
                      >
                        <td className="px-3 py-2.5">
                          <p className="font-medium">{role.name}</p>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground">
                          {role.description}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 2).map((permission) => (
                              <span
                                key={permission}
                                className="rounded-sm border border-border/70 bg-background px-2 py-0.5 text-[10px]"
                              >
                                {permission}
                              </span>
                            ))}
                            {role.permissions.length > 2 ? (
                              <span className="rounded-sm border border-border/70 bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                                +{role.permissions.length - 2}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-xs font-medium">
                          {memberCountByRoleId[role.id] ?? 0}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex justify-end gap-1.5">
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-xs text-muted-foreground"
                      >
                        No roles found for your current search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {filteredRoles.length ? (
                filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    className="rounded-md border border-border/70 bg-background/90 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{role.name}</p>
                      <span className="rounded-sm border border-border/70 bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
                        {memberCountByRoleId[role.id] ?? 0} members
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {role.description}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="rounded-sm border border-border/70 bg-card px-2 py-0.5 text-[10px]"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2.5 flex gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        className="flex-1"
                        onClick={() => beginRoleEdit(role)}
                      >
                        <IconEdit className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeRole(role.id)}
                      >
                        <IconTrash className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full py-8 text-center text-xs text-muted-foreground">
                  No roles found for your current search.
                </p>
              )}
            </div>
          )}
        </section>
      </section>

      <ManagementModal
        open={isUserModalOpen}
        onClose={closeUserModal}
        title={userForm.id ? "Edit User" : "Create User"}
        description="Add members and assign them to the right role"
      >
        <form className="space-y-3" onSubmit={handleUserSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="user-name">Full Name</Label>
            <Input
              id="user-name"
              value={userForm.name}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={userForm.email}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="name@company.com"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-role">Role</Label>
              <select
                id="user-role"
                value={userForm.roleId}
                onChange={(event) =>
                  setUserForm((current) => ({
                    ...current,
                    roleId: event.target.value,
                  }))
                }
                className={selectClassName}
              >
                <option value="">Unassigned</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-status">Status</Label>
              <select
                id="user-status"
                value={userForm.status}
                onChange={(event) =>
                  setUserForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                className={selectClassName}
              >
                <option value="Active">Active</option>
                <option value="Busy">Busy</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          {userError ? (
            <p className="text-xs font-medium text-destructive">{userError}</p>
          ) : null}

          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1">
              {userForm.id ? "Update User" : "Create User"}
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

      <ManagementModal
        open={isRoleModalOpen}
        onClose={closeRoleModal}
        title={roleForm.id ? "Edit Role" : "Create Role"}
        description="Define role permissions and team ownership levels"
      >
        <form className="space-y-3" onSubmit={handleRoleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={roleForm.name}
              onChange={(event) =>
                setRoleForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. QA Lead"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-description">Description</Label>
            <textarea
              id="role-description"
              value={roleForm.description}
              onChange={(event) =>
                setRoleForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe responsibilities for this role"
              className={textareaClassName}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-permissions">Permissions</Label>
            <Input
              id="role-permissions"
              value={roleForm.permissions}
              onChange={(event) =>
                setRoleForm((current) => ({
                  ...current,
                  permissions: event.target.value,
                }))
              }
              placeholder="manage_users, view_reports, assign_tasks"
            />
            <p className="text-[11px] text-muted-foreground">
              Use comma-separated values for permissions.
            </p>
          </div>

          {roleError ? (
            <p className="text-xs font-medium text-destructive">{roleError}</p>
          ) : null}

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
