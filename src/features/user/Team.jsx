import { useMemo, useState } from "react";
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
import EmptyState from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import Role from "./pages/Role";

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

function clampPage(page, totalPages) {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
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

function TableHeadLabel({ Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/80">
      <Icon className="size-3.5 text-muted-foreground" />
      {label}
    </span>
  );
}

function PaginationFooter({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
}) {
  if (totalPages <= 1) return null;

  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-2 border-t border-border/40 bg-card/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span>-
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span>{" "}
        {itemLabel}
      </p>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <p className="text-xs text-muted-foreground">
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
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
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Team() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");

  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const usersPerPage = 4;

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const userForm = useForm({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      roleId: INITIAL_ROLES[0]?.id ?? "",
      status: "Active",
    },
  });

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) =>
      [u.name, u.email, u.status].some((val) => val?.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const totalUserPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );
  const activeUserPage = clampPage(userCurrentPage, totalUserPages);

  const paginatedUsers = useMemo(() => {
    const start = (activeUserPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, activeUserPage, usersPerPage]);

  const statCards = useMemo(
    () => [
      { label: "Total Users", value: users.length, Icon: IconUsers },
      { label: "Total Roles", value: 4, Icon: IconShieldCheck },
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
    [users]
  );

  const openCreateUserModal = () => {
    userForm.reset({
      id: "",
      name: "",
      email: "",
      roleId: "",
      status: "Active",
    });
    setIsUserModalOpen(true);
  };

  console.log(openCreateUserModal);

  const handleUserSubmit = (values) => {
    const payload = { ...values, lastActive: "Just now" };
    if (values.id)
      setUsers((cur) =>
        cur.map((u) => (u.id === values.id ? { ...u, ...payload } : u))
      );
    else setUsers((cur) => [{ id: createId("user"), ...payload }, ...cur]);
    setIsUserModalOpen(false);
  };

  const beginUserEdit = (user) => {
    userForm.reset(user);
    setIsUserModalOpen(true);
  };

  const removeUser = (id) => setUsers((cur) => cur.filter((u) => u.id !== id));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="flex w-full min-w-0 animate-in flex-col gap-6 duration-500 fade-in">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
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
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
          <Card
            key={item.label}
            className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
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
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
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
        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full min-w-0"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <TabsList className="border border-border/40 bg-background/60 shadow-sm">
              <TabsTrigger value="users" className="gap-2">
                <IconUsers className="size-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-2">
                <IconShieldCheck className="size-4" />
                Roles
              </TabsTrigger>
            </TabsList>

            <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setUserCurrentPage(1);
                  }}
                  placeholder={
                    activeTab === "users"
                      ? "Search users..."
                      : "Search roles..."
                  }
                  className="h-9 w-full rounded-xl border-border/50 bg-background/60 pl-9 text-sm shadow-sm sm:w-64"
                />
              </div>
              {/* <Button
                type="button"
                onClick={
                  activeTab === "users"
                    ? openCreateUserModal
                    : openCreateRoleModal
                }
                className="shrink-0 gap-1.5 rounded-xl"
              >
                <IconPlus className="size-4" />
                <span className="hidden sm:inline">
                  {activeTab === "users" ? "Add User" : "Add Role"}
                </span>
                <span className="sm:hidden">Add</span>
              </Button>*/}
            </div>
          </div>

          {/* Content Areas */}
          <TabsContent value="users" className="mt-0 outline-none">
            <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur">
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 bg-muted/30 hover:bg-muted/30">
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
                        const role = null;
                        const roleColor = null;
                        return (
                          <TableRow
                            key={user.id}
                            className="group/row border-border/40 transition-colors hover:bg-muted/20"
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
                currentPage={activeUserPage}
                totalPages={totalUserPages}
                totalItems={filteredUsers.length}
                itemsPerPage={usersPerPage}
                itemLabel="users"
                onPageChange={(nextPage) =>
                  setUserCurrentPage(clampPage(nextPage, totalUserPages))
                }
              />
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-0 outline-none">
            <Role searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
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
                          {/* {roles.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}*/}
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
    </main>
  );
}

export default Team;
