import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IconActivity,
  IconBolt,
  IconChecklist,
  IconClockHour4,
  IconEdit,
  IconMail,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconTrash,
  IconUsers,
  IconDotsVertical,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  Active: "bg-emerald-500",
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
  },
  {
    icon: "text-blue-500",
    bg: "border-blue-500/20   bg-blue-500/10",
  },
  {
    icon: "text-emerald-500",
    bg: "border-emerald-500/20 bg-emerald-500/10",
  },
  {
    icon: "text-rose-500",
    bg: "border-rose-500/20   bg-rose-500/10",
  },
  {
    icon: "text-amber-500",
    bg: "border-amber-500/20  bg-amber-500/10",
  },
  {
    icon: "text-sky-500",
    bg: "border-sky-500/20    bg-sky-500/10",
  },
];

const PERMISSION_STYLES = {
  manage_users: "bg-violet-500/10 text-violet-600",
  manage_roles: "bg-purple-500/10 text-purple-600",
  view_reports: "bg-blue-500/10 text-blue-600",
  assign_tasks: "bg-amber-500/10 text-amber-600",
  manage_projects: "bg-emerald-500/10 text-emerald-600",
  update_tasks: "bg-cyan-500/10 text-cyan-600",
  view_projects: "bg-sky-500/10 text-sky-600",
  comment_tasks: "bg-rose-500/10 text-rose-600",
};

const STAT_COLORS = [
  { color: "text-blue-500", bg: "border-blue-500/20    bg-blue-500/8" },
  { color: "text-violet-500", bg: "border-violet-500/20  bg-violet-500/8" },
  { color: "text-emerald-500", bg: "border-emerald-500/20 bg-emerald-500/8" },
  { color: "text-amber-500", bg: "border-amber-500/20   bg-amber-500/8" },
];

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
  return PERMISSION_STYLES[permission] ?? "bg-muted text-muted-foreground";
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
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        getPermissionStyle(permission)
      )}
    >
      {permission}
    </span>
  );
}

function TableHeadLabel({ Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/80">
      <Icon className="size-3.5 text-muted-foreground" />
      {label}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <span className="text-muted-foreground/40">
        <IconSearch className="size-8" />
      </span>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Team() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [searchQuery, setSearchQuery] = useState("");

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const userForm = useForm({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      roleId: INITIAL_ROLES[0]?.id ?? "",
      status: "Active",
    },
  });

  const roleForm = useForm({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      permissions: "",
    },
  });

  // ── Derived data ─────────────────────────────────────────────────────────

  const roleById = useMemo(
    () => roles.reduce((acc, r) => ({ ...acc, [r.id]: r }), {}),
    [roles]
  );

  const roleColorByIndex = useMemo(
    () =>
      roles.reduce(
        (acc, r, i) => ({
          ...acc,
          [r.id]: ROLE_COLORS[i % ROLE_COLORS.length],
        }),
        {}
      ),
    [roles]
  );

  const membersByRoleId = useMemo(
    () =>
      users.reduce(
        (acc, u) => ({ ...acc, [u.roleId]: [...(acc[u.roleId] ?? []), u] }),
        {}
      ),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) =>
      [u.name, u.email, u.status].some((val) => val?.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return roles.filter((r) =>
      [r.name, r.description].some((val) => val?.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  const statCards = useMemo(
    () => [
      { label: "Total Users", value: users.length, Icon: IconUsers },
      { label: "Total Roles", value: roles.length, Icon: IconShieldCheck },
      {
        label: "Active Now",
        value: users.filter((u) => u.status === "Active").length,
        Icon: IconActivity,
      },
      {
        label: "Unassigned",
        value: users.filter((u) => !u.roleId).length,
        Icon: IconBolt,
      },
    ],
    [users, roles]
  );

  const openCreateUserModal = () => {
    userForm.reset({
      id: "",
      name: "",
      email: "",
      roleId: roles[0]?.id ?? "",
      status: "Active",
    });
    setIsUserModalOpen(true);
  };

  const openCreateRoleModal = () => {
    roleForm.reset({ id: "", name: "", description: "", permissions: "" });
    setIsRoleModalOpen(true);
  };

  const handleUserSubmit = (values) => {
    const payload = { ...values, lastActive: "Just now" };
    if (values.id)
      setUsers((cur) =>
        cur.map((u) => (u.id === values.id ? { ...u, ...payload } : u))
      );
    else setUsers((cur) => [{ id: createId("user"), ...payload }, ...cur]);
    setIsUserModalOpen(false);
  };

  const handleRoleSubmit = (values) => {
    const payload = {
      ...values,
      permissions: values.permissions.split(",").map((p) => p.trim()),
    };
    if (values.id)
      setRoles((cur) =>
        cur.map((r) => (r.id === values.id ? { ...r, ...payload } : r))
      );
    else setRoles((cur) => [{ id: createId("role"), ...payload }, ...cur]);
    setIsRoleModalOpen(false);
  };

  const beginUserEdit = (user) => {
    userForm.reset(user);
    setIsUserModalOpen(true);
  };

  const beginRoleEdit = (role) => {
    roleForm.reset({ ...role, permissions: role.permissions.join(", ") });
    setIsRoleModalOpen(true);
  };

  const removeUser = (id) => setUsers((cur) => cur.filter((u) => u.id !== id));
  const removeRole = (id) => {
    setRoles((cur) => cur.filter((r) => r.id !== id));
    setUsers((cur) =>
      cur.map((u) => (u.roleId === id ? { ...u, roleId: "" } : u))
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="grid gap-6">
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
          <Tabs
            defaultValue="users"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 p-4 md:p-5">
              <TabsList className="bg-background/50">
                <TabsTrigger value="users" className="gap-1.5">
                  <IconUsers className="size-4" />
                  Users
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-[10px]"
                  >
                    {users.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="roles" className="gap-1.5">
                  <IconShieldCheck className="size-4" />
                  Roles
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-[10px]"
                  >
                    {roles.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === "users"
                        ? "Search users..."
                        : "Search roles..."
                    }
                    className="h-9 w-64 rounded-lg bg-background/70 pl-8 text-sm"
                  />
                </div>
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

            {/* Content */}
            <div className="p-4 md:p-5">
              <TabsContent value="users" className="mt-0 outline-none">
                <div className="overflow-x-auto rounded-xl border border-border/50 bg-background/30">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>
                          <TableHeadLabel Icon={IconUsers} label="Member" />
                        </TableHead>
                        <TableHead>
                          <TableHeadLabel Icon={IconShieldCheck} label="Role" />
                        </TableHead>
                        <TableHead>
                          <TableHeadLabel Icon={IconChecklist} label="Status" />
                        </TableHead>
                        <TableHead>
                          <TableHeadLabel
                            Icon={IconClockHour4}
                            label="Last Active"
                          />
                        </TableHead>
                        <TableHead className="w-16 text-right">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <EmptyState message="No users found." />
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => {
                          const role = roleById[user.roleId];
                          const roleColor = roleColorByIndex[user.roleId];
                          return (
                            <TableRow
                              key={user.id}
                              className="group/row transition-colors duration-150"
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <UserAvatar name={user.name} size="md" />
                                  <div>
                                    <p className="leading-none font-medium">
                                      {user.name}
                                    </p>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                      <IconMail className="size-3" />
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {role ? (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "gap-1 border-transparent px-2 py-0.5 text-[10px] font-semibold",
                                      roleColor?.bg,
                                      roleColor?.icon
                                    )}
                                  >
                                    <IconShieldCheck className="size-3" />
                                    {role.name}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic">
                                    Unassigned
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "gap-1.5 border-transparent px-2 py-0.5 text-xs font-medium",
                                    STATUS_STYLES[user.status] ??
                                      STATUS_STYLES.Offline
                                  )}
                                >
                                  <StatusDot status={user.status} />
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {user.lastActive}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      className="opacity-0 group-hover/row:opacity-100 data-[state=open]:opacity-100"
                                    >
                                      <IconDotsVertical className="size-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-40"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => beginUserEdit(user)}
                                    >
                                      <IconEdit className="mr-2 size-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                      onClick={() => removeUser(user.id)}
                                    >
                                      <IconTrash className="mr-2 size-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="roles" className="mt-0 outline-none">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRoles.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState message="No roles found." />
                    </div>
                  ) : (
                    filteredRoles.map((role, i) => {
                      const color = ROLE_COLORS[i % ROLE_COLORS.length];
                      const members = membersByRoleId[role.id] ?? [];
                      return (
                        <Card
                          key={role.id}
                          className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "inline-flex size-10 items-center justify-center rounded-xl border",
                                    color.bg
                                  )}
                                >
                                  <IconShieldCheck
                                    className={cn("size-5", color.icon)}
                                  />
                                </span>
                                <div>
                                  <CardTitle className="text-base">
                                    {role.name}
                                  </CardTitle>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {members.length} member
                                    {members.length !== 1 && "s"}
                                  </p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="-mt-2 -mr-2"
                                  >
                                    <IconDotsVertical className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => beginRoleEdit(role)}
                                  >
                                    <IconEdit className="mr-2 size-4" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => removeRole(role.id)}
                                  >
                                    <IconTrash className="mr-2 size-4" />
                                    Delete Role
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                              {role.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {role.permissions.slice(0, 3).map((p) => (
                                <PermissionChip key={p} permission={p} />
                              ))}
                              {role.permissions.length > 3 && (
                                <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                  +{role.permissions.length - 3} more
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </section>

      {/* User Dialog */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {userForm.getValues().id ? "Edit User" : "Create User"}
            </DialogTitle>
            <DialogDescription>
              Manage user details and role assignment.
            </DialogDescription>
          </DialogHeader>
          <Form {...userForm}>
            <form
              onSubmit={userForm.handleSubmit(handleUserSubmit)}
              className="space-y-4"
            >
              <FormField
                control={userForm.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 border-t border-border/40 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {userForm.getValues().id ? "Save Changes" : "Create User"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {roleForm.getValues().id ? "Edit Role" : "Create Role"}
            </DialogTitle>
            <DialogDescription>
              Define role access and descriptive properties.
            </DialogDescription>
          </DialogHeader>
          <Form {...roleForm}>
            <form
              onSubmit={roleForm.handleSubmit(handleRoleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={roleForm.control}
                name="name"
                rules={{ required: "Role name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Editor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={roleForm.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="What does this role do?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={roleForm.control}
                name="permissions"
                rules={{ required: "At least one permission is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="read, write, delete (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="mt-1.5 text-[10px] text-muted-foreground">
                      Comma separated permission identifiers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 border-t border-border/40 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {roleForm.getValues().id ? "Save Changes" : "Create Role"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Team;
