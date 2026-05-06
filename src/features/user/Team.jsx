import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IconActivity,
  IconBolt,
  IconChecklist,
  IconChevronLeft,
  IconChevronRight,
  IconClockHour4,
  IconDotsVertical,
  IconEdit,
  IconMail,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconTrash,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import RequiredMark from "@/components/common/RequiredMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  {
    id: "user-5",
    name: "Karan Singh",
    email: "karan@nexflow.com",
    roleId: "role-developer",
    status: "Active",
    lastActive: "10 min ago",
  },
  {
    id: "user-6",
    name: "Pooja Verma",
    email: "pooja@nexflow.com",
    roleId: "role-designer",
    status: "Offline",
    lastActive: "2 hours ago",
  },
];

// ─── Style Constants ───────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Active: "border-success/30 bg-success/10 text-success",
  Busy: "border-warning/30 bg-warning/10 text-warning",
  Offline: "border-border/60 bg-muted/50 text-muted-foreground",
};

const STATUS_DOT = {
  Active: "bg-success",
  Busy: "bg-warning",
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
  { icon: "text-primary", bg: "border-primary/20 bg-primary/10" },
  { icon: "text-info", bg: "border-info/20 bg-info/10" },
  { icon: "text-success", bg: "border-success/20 bg-success/10" },
  { icon: "text-destructive", bg: "border-destructive/20 bg-destructive/10" },
  { icon: "text-warning", bg: "border-warning/20 bg-warning/10" },
  { icon: "text-pending", bg: "border-pending/20 bg-pending/10" },
];

const PERMISSION_STYLES = {
  manage_users: "bg-primary/10 text-primary",
  manage_roles: "bg-info/10 text-info",
  view_reports: "bg-success/10 text-success",
  assign_tasks: "bg-warning/10 text-warning",
  manage_projects: "bg-pending/10 text-pending",
  update_tasks: "bg-destructive/10 text-destructive",
  view_projects: "bg-primary/10 text-primary",
  comment_tasks: "bg-info/10 text-info",
};

const STAT_COLORS = [
  { color: "text-info", bg: "border-info/20 bg-info/8" },
  { color: "text-primary", bg: "border-primary/20 bg-primary/8" },
  { color: "text-success", bg: "border-success/20 bg-success/8" },
  { color: "text-warning", bg: "border-warning/20 bg-warning/8" },
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

function PaginationFooter({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-border/40 bg-card/20 px-4 py-3 sm:px-6">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span>{" "}
        of <span className="font-medium text-foreground">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 gap-1 px-3 text-xs shadow-none"
        >
          <IconChevronLeft className="size-3.5" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 gap-1 px-3 text-xs shadow-none"
        >
          Next
          <IconChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Team() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Show 4 per page for better UI testing

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

  // Reset pagination when search or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

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
    <main className="grid animate-in gap-6 duration-500 fade-in">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <Card className="relative overflow-hidden border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -right-10 size-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <IconChecklist className="size-5 text-primary" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Team Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage your workspace members, roles, and platform access.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
          <Card
            key={item.label}
            className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight">
                  {String(item.value)}
                </p>
              </div>
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110",
                  STAT_COLORS[index]?.bg ?? "border-primary/20 bg-primary/10"
                )}
              >
                <item.Icon
                  className={cn(
                    "size-5.5",
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
        <Card className="overflow-hidden rounded-2xl border border-border/40 bg-card/40 shadow-sm backdrop-blur-sm">
          <Tabs
            defaultValue="users"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Toolbar */}
            <div className="flex flex-col gap-4 border-b border-border/40 bg-background/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <TabsList className="h-10 bg-muted/50 p-1">
                <TabsTrigger
                  value="users"
                  className="gap-2 rounded-md px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <IconUsers className="size-4" />
                  Users
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-[10px] font-semibold"
                  >
                    {users.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="roles"
                  className="gap-2 rounded-md px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <IconShieldCheck className="size-4" />
                  Roles
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-[10px] font-semibold"
                  >
                    {roles.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <div className="group relative w-full sm:w-64">
                  <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === "users"
                        ? "Search users..."
                        : "Search roles..."
                    }
                    className="h-10 bg-background/50 pl-9 transition-colors hover:bg-background focus-visible:bg-background"
                  />
                </div>
                <Button
                  type="button"
                  onClick={
                    activeTab === "users"
                      ? openCreateUserModal
                      : openCreateRoleModal
                  }
                  className="shrink-0 gap-2 shadow-sm transition-all hover:shadow-md active:scale-95"
                >
                  <IconPlus className="size-4" />
                  {activeTab === "users" ? "Add User" : "Add Role"}
                </Button>
              </div>
            </div>

            {/* Content Areas */}
            <TabsContent value="users" className="m-0 border-none outline-none">
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="py-4">
                        <TableHeadLabel Icon={IconUsers} label="Member" />
                      </TableHead>
                      <TableHead className="py-4">
                        <TableHeadLabel Icon={IconShieldCheck} label="Role" />
                      </TableHead>
                      <TableHead className="py-4">
                        <TableHeadLabel Icon={IconChecklist} label="Status" />
                      </TableHead>
                      <TableHead className="py-4">
                        <TableHeadLabel
                          Icon={IconClockHour4}
                          label="Last Active"
                        />
                      </TableHead>
                      <TableHead className="py-4 text-right">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center">
                          <EmptyState message="No users match your criteria." />
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => {
                        const role = roleById[user.roleId];
                        const roleColor = roleColorByIndex[user.roleId];
                        return (
                          <TableRow
                            key={user.id}
                            className="group/row transition-colors hover:bg-muted/30"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-4">
                                <UserAvatar name={user.name} size="md" />
                                <div>
                                  <p className="font-semibold">{user.name}</p>
                                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <IconMail className="size-3" />
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {role ? (
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "gap-1.5 rounded-full border-transparent px-2.5 py-1 text-xs font-semibold shadow-none",
                                    roleColor?.bg,
                                    roleColor?.icon
                                  )}
                                >
                                  <IconShieldCheck className="size-3.5" />
                                  {role.name}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="gap-1.5 rounded-full text-xs text-muted-foreground shadow-none"
                                >
                                  <IconBolt className="size-3.5" />
                                  Unassigned
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-none",
                                  STATUS_STYLES[user.status] ??
                                    STATUS_STYLES.Offline
                                )}
                              >
                                <StatusDot status={user.status} />
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 text-sm text-muted-foreground">
                              {user.lastActive}
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 transition-opacity group-hover/row:opacity-100 data-[state=open]:opacity-100"
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
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => removeUser(user.id)}
                                  >
                                    <IconTrash className="mr-2 size-4" />
                                    Remove User
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
              <PaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </TabsContent>

            <TabsContent
              value="roles"
              className="m-0 border-none p-5 outline-none sm:p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRoles.length === 0 ? (
                  <div className="col-span-full flex h-48 items-center justify-center">
                    <EmptyState message="No roles match your criteria." />
                  </div>
                ) : (
                  filteredRoles.map((role, i) => {
                    const color = ROLE_COLORS[i % ROLE_COLORS.length];
                    const members = membersByRoleId[role.id] ?? [];
                    return (
                      <Card
                        key={role.id}
                        className="relative flex flex-col justify-between overflow-hidden border border-border/40 bg-background/50 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "flex size-11 items-center justify-center rounded-xl border shadow-inner",
                                  color.bg
                                )}
                              >
                                <IconShieldCheck
                                  className={cn("size-5.5", color.icon)}
                                />
                              </span>
                              <div>
                                <CardTitle className="text-base font-bold">
                                  {role.name}
                                </CardTitle>
                                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                  {members.length} Assigned User
                                  {members.length !== 1 && "s"}
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="-mt-2 -mr-2 h-8 w-8"
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
                          <p className="mb-5 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                            {role.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.slice(0, 3).map((p) => (
                              <PermissionChip key={p} permission={p} />
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
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
          </Tabs>
        </Card>
      </section>

      {/* ── Add / Edit User Dialog ─────────────────────────────────────────── */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">
              {userForm.getValues().id
                ? "Update User Role & Status"
                : "Invite New User"}
            </DialogTitle>
            <DialogDescription>
              Assign the correct access level and status for this team member.
            </DialogDescription>
          </DialogHeader>

          <Form {...userForm}>
            <form
              onSubmit={userForm.handleSubmit(handleUserSubmit)}
              className="grid gap-5"
            >
              <FormField
                control={userForm.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Full Name
                      <RequiredMark />
                    </FormLabel>
                    <div className="group relative">
                      <IconUser className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <FormControl>
                        <Input
                          placeholder="e.g. Jane Doe"
                          className="h-11 bg-background/50 pl-10 focus-visible:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-[11px]" />
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
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Email Address
                      <RequiredMark />
                    </FormLabel>
                    <div className="group relative">
                      <IconMail className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <FormControl>
                        <Input
                          placeholder="jane@example.com"
                          type="email"
                          className="h-11 bg-background/50 pl-10 focus-visible:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={userForm.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Assigned Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background/50 focus:ring-primary/20">
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
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background/50 focus:ring-primary/20">
                            <SelectValue placeholder="Set status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Busy">Busy</SelectItem>
                          <SelectItem value="Offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-border/40 pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2 shadow-sm">
                  {userForm.getValues().id ? "Save Changes" : "Create User"}
                  {!userForm.getValues().id && <IconPlus className="size-4" />}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ── Add / Edit Role Dialog ─────────────────────────────────────────── */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">
              {roleForm.getValues().id
                ? "Update Role Definition"
                : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              Define the permissions and responsibilities for this role group.
            </DialogDescription>
          </DialogHeader>

          <Form {...roleForm}>
            <form
              onSubmit={roleForm.handleSubmit(handleRoleSubmit)}
              className="grid gap-5"
            >
              <FormField
                control={roleForm.control}
                name="name"
                rules={{ required: "Role name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Role Name
                      <RequiredMark />
                    </FormLabel>
                    <div className="group relative">
                      <IconShieldCheck className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <FormControl>
                        <Input
                          placeholder="e.g. Super Admin"
                          className="h-11 bg-background/50 pl-10 focus-visible:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={roleForm.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Description
                      <RequiredMark />
                    </FormLabel>
                    <div className="group relative">
                      <IconEdit className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <FormControl>
                        <Input
                          placeholder="What does this role entail?"
                          className="h-11 bg-background/50 pl-10 focus-visible:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={roleForm.control}
                name="permissions"
                rules={{ required: "At least one permission is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Permissions
                      <RequiredMark />
                    </FormLabel>
                    <div className="group relative">
                      <IconChecklist className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <FormControl>
                        <Input
                          placeholder="e.g. read, write, delete"
                          className="h-11 bg-background/50 pl-10 focus-visible:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                      Enter permission identifiers separated by commas.
                    </FormDescription>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-border/40 pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2 shadow-sm">
                  {roleForm.getValues().id ? "Save Role" : "Create Role"}
                  {!roleForm.getValues().id && <IconPlus className="size-4" />}
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
