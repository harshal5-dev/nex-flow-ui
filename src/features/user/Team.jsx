import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  IconAdjustmentsHorizontal,
  IconChecklist,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconMail,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconTrash,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import EmptyState from "@/components/common/EmptyState";
import RequiredMark from "@/components/common/RequiredMark";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useGetRolesQuery } from "./api/roleApi";
import RoleMultiSelect from "./components/RoleMultiSelect";
import { ROLE_COLORS } from "./constants/user.contants";
import Role from "./pages/Role";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FALLBACK_ROLES = [
  {
    id: "role-admin",
    code: "admin",
    name: "Admin",
    description: "Full workspace access and management permissions.",
  },
  {
    id: "role-manager",
    code: "manager",
    name: "Manager",
    description: "Owns delivery planning and cross-team coordination.",
  },
  {
    id: "role-developer",
    code: "developer",
    name: "Developer",
    description: "Builds product features and resolves sprint tasks.",
  },
  {
    id: "role-designer",
    code: "designer",
    name: "Designer",
    description: "Creates product UI and contributes design updates.",
  },
];

const INITIAL_USERS = [
  {
    id: "user-1",
    firstName: "Shraddha",
    lastName: "Harshal",
    emailId: "shraddha@nexflow.com",
    roles: ["admin", "manager"],
  },
  {
    id: "user-2",
    firstName: "Ananya",
    lastName: "Sharma",
    emailId: "ananya@nexflow.com",
    roles: ["manager"],
  },
  {
    id: "user-3",
    firstName: "Rahul",
    lastName: "Patil",
    emailId: "rahul@nexflow.com",
    roles: ["developer"],
  },
  {
    id: "user-4",
    firstName: "Nina",
    lastName: "Mehta",
    emailId: "nina@nexflow.com",
    roles: ["designer"],
  },
  {
    id: "user-5",
    firstName: "Karan",
    lastName: "Singh",
    emailId: "karan@nexflow.com",
    roles: ["developer", "designer"],
  },
  {
    id: "user-6",
    firstName: "Pooja",
    lastName: "Verma",
    emailId: "pooja@nexflow.com",
    roles: [],
  },
];

// ─── Style Constants ───────────────────────────────────────────────────────────

const AVATAR_THEMES = [
  {
    shell: "from-primary/18 to-primary/6 border-primary/30",
    orbA: "bg-primary/45",
    orbB: "bg-primary/22",
    stripe: "bg-primary/25",
  },
  {
    shell: "from-info/18 to-info/6 border-info/30",
    orbA: "bg-info/45",
    orbB: "bg-info/22",
    stripe: "bg-info/25",
  },
  {
    shell: "from-success/18 to-success/6 border-success/30",
    orbA: "bg-success/45",
    orbB: "bg-success/22",
    stripe: "bg-success/25",
  },
  {
    shell: "from-warning/18 to-warning/6 border-warning/30",
    orbA: "bg-warning/45",
    orbB: "bg-warning/22",
    stripe: "bg-warning/25",
  },
  {
    shell: "from-destructive/18 to-destructive/6 border-destructive/30",
    orbA: "bg-destructive/40",
    orbB: "bg-destructive/20",
    stripe: "bg-destructive/20",
  },
  {
    shell: "from-pending/18 to-pending/6 border-pending/30",
    orbA: "bg-pending/45",
    orbB: "bg-pending/22",
    stripe: "bg-pending/25",
  },
];

const STAT_COLORS = [
  { color: "text-info", bg: "border-info/20 bg-info/8" },
  { color: "text-primary", bg: "border-primary/20 bg-primary/8" },
  { color: "text-success", bg: "border-success/20 bg-success/8" },
  { color: "text-warning", bg: "border-warning/20 bg-warning/8" },
];

const EMPTY_LIST = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function getFullName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}

function getInitials(firstName, lastName) {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";

  if (!first && !last) return "?";
  if (first && last) return `${first}${last}`.toUpperCase();

  return first.toUpperCase() || last.toUpperCase();
}

function getAvatarTheme(name) {
  const code = (name?.charCodeAt(0) ?? 0) + (name?.charCodeAt(1) ?? 0);
  return AVATAR_THEMES[code % AVATAR_THEMES.length];
}

function clampPage(page, totalPages) {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UserAvatar({ firstName, lastName, size = "md", className }) {
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  const theme = getAvatarTheme(displayName);
  const sizeClass = {
    sm: "size-9 text-[10px]",
    md: "size-11 text-xs",
    lg: "size-[3.25rem] text-sm",
  }[size];

  return (
    <Avatar
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-0.5 shadow-sm ring-1 ring-border/30",
        sizeClass,
        className
      )}
      title={displayName || "User"}
    >
      <AvatarFallback
        className={cn(
          "relative flex size-full items-center justify-center rounded-[0.8rem] bg-linear-to-br",
          theme.shell
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute -top-3 -right-2 size-8 rounded-full blur-[0.5px]",
            theme.orbA
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute -bottom-4 -left-3 size-11 rounded-full",
            theme.orbB
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-1.5",
            theme.stripe
          )}
        />
        <span className="relative z-10 inline-flex min-w-7 items-center justify-center rounded-md border border-white/75 bg-white/80 px-1.5 py-0.5 text-[0.78em] font-extrabold tracking-wide text-foreground shadow-sm backdrop-blur">
          {getInitials(firstName, lastName)}
        </span>
      </AvatarFallback>
    </Avatar>
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

  const roleResponse = useGetRolesQuery();
  const {
    data: rolesData = [],
    isLoading: rolesLoading,
    isFetching: rolesFetching,
    isError: rolesError,
  } = roleResponse || {};

  const availableRoles = useMemo(() => {
    if (Array.isArray(rolesData) && rolesData.length > 0) {
      return rolesData
        .map((role) => {
          const value = role?.code || role?._id;
          if (!value) return null;

          return {
            id: role?._id || value,
            value,
            label: role?.name || value,
            description: role?.description || "",
          };
        })
        .filter(Boolean);
    }

    return FALLBACK_ROLES.map((role) => ({
      id: role.id,
      value: role.code,
      label: role.name,
      description: role.description,
    }));
  }, [rolesData]);

  const roleByValue = useMemo(
    () =>
      availableRoles.reduce(
        (acc, role) => ({ ...acc, [role.value]: role }),
        {}
      ),
    [availableRoles]
  );

  const roleColorByValue = useMemo(
    () =>
      availableRoles.reduce(
        (acc, role, index) => ({
          ...acc,
          [role.value]: ROLE_COLORS[index % ROLE_COLORS.length],
        }),
        {}
      ),
    [availableRoles]
  );

  const userForm = useForm({
    mode: "onBlur",
    defaultValues: {
      id: "",
      firstName: "",
      lastName: "",
      emailId: "",
      roles: [],
    },
  });

  const watchedRoleValues = useWatch({
    control: userForm.control,
    name: "roles",
  });
  const selectedRoleValues = Array.isArray(watchedRoleValues)
    ? watchedRoleValues
    : EMPTY_LIST;
  const editingUserId = useWatch({ control: userForm.control, name: "id" });

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      const roleLabelText = (user.roles ?? [])
        .map((roleValue) => roleByValue[roleValue]?.label ?? roleValue)
        .join(" ")
        .toLowerCase();

      return [
        user.firstName,
        user.lastName,
        getFullName(user),
        user.emailId,
        roleLabelText,
      ].some((text) =>
        String(text ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [users, searchQuery, roleByValue]);

  const totalUserPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );
  const activeUserPage = clampPage(userCurrentPage, totalUserPages);

  const paginatedUsers = useMemo(() => {
    const start = (activeUserPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, activeUserPage, usersPerPage]);

  const selectedRolePreview = useMemo(
    () =>
      selectedRoleValues
        .map((roleValue) => roleByValue[roleValue])
        .filter(Boolean),
    [selectedRoleValues, roleByValue]
  );

  const statCards = useMemo(
    () => [
      { label: "Team Members", value: users.length, Icon: IconUsers },
      {
        label: "Roles Available",
        value: availableRoles.length,
        Icon: IconShieldCheck,
      },
      {
        label: "Multi-Role Members",
        value: users.filter((user) => (user.roles?.length ?? 0) > 1).length,
        Icon: IconChecklist,
      },
      {
        label: "No Assigned Role",
        value: users.filter((user) => (user.roles?.length ?? 0) === 0).length,
        Icon: IconUser,
      },
    ],
    [users, availableRoles.length]
  );

  const openCreateUserModal = () => {
    userForm.reset({
      id: "",
      firstName: "",
      lastName: "",
      emailId: "",
      roles: [],
    });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (values) => {
    const payload = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      emailId: values.emailId.trim(),
      roles: Array.from(new Set(values.roles ?? [])),
    };

    if (values.id) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === values.id ? { ...user, ...payload } : user
        )
      );
    } else {
      setUsers((currentUsers) => [
        { id: createId("user"), ...payload },
        ...currentUsers,
      ]);
    }

    setIsUserModalOpen(false);
  };

  const beginUserEdit = (user) => {
    userForm.reset({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      roles: Array.isArray(user.roles) ? user.roles : [],
    });
    setIsUserModalOpen(true);
  };

  const removeUser = (id) =>
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchQuery("");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="flex w-full min-w-0 animate-in flex-col gap-6 duration-500 fade-in">
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
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
          <Card
            key={item.label}
            className="group relative overflow-hidden border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
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
          onValueChange={handleTabChange}
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
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setUserCurrentPage(1);
                  }}
                  placeholder={
                    activeTab === "users"
                      ? "Search users..."
                      : "Search roles..."
                  }
                  className="w-full border-border/50 bg-background/60 pl-9 text-sm shadow-sm sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Content Areas */}
          <TabsContent value="users" className="mt-0 outline-none">
            <Card className="overflow-hidden border-border/50 bg-card/60 shadow-sm backdrop-blur">
              <div className="border-b border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-tight">
                      User Directory
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invite members and assign one or more roles for controlled
                      access.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button
                      type="button"
                      onClick={openCreateUserModal}
                      className="gap-1.5 px-3.5 shadow-sm"
                    >
                      <IconPlus className="size-4" />
                      Add User
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 bg-muted/30 hover:bg-muted/30">
                      <TableHead className="py-3.5">
                        <TableHeadLabel Icon={IconUser} label="First Name" />
                      </TableHead>
                      <TableHead className="py-3.5">
                        <TableHeadLabel Icon={IconUser} label="Last Name" />
                      </TableHead>
                      <TableHead className="py-3.5">
                        <TableHeadLabel Icon={IconMail} label="Email ID" />
                      </TableHead>
                      <TableHead className="py-3.5">
                        <TableHeadLabel Icon={IconShieldCheck} label="Roles" />
                      </TableHead>
                      <TableHead className="py-3.5 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-foreground/80 uppercase">
                          <IconAdjustmentsHorizontal className="size-3.5 text-muted-foreground" />
                          Action
                        </span>
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
                        const visibleRoles = (user.roles ?? []).slice(0, 2);
                        const extraRoleCount =
                          (user.roles ?? []).length - visibleRoles.length;

                        return (
                          <TableRow
                            key={user.id}
                            className="group/row border-border/40 transition-colors hover:bg-muted/15"
                          >
                            <TableCell className="py-3.5">
                              <div className="flex items-center gap-3">
                                <UserAvatar
                                  firstName={user.firstName}
                                  lastName={user.lastName}
                                  size="md"
                                />
                                <div>
                                  <p className="font-semibold tracking-tight">
                                    {user.firstName}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-3.5 text-sm font-medium text-foreground">
                              {user.lastName}
                            </TableCell>

                            <TableCell className="py-3.5 text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/25 px-2.5 py-0.5 font-medium text-foreground/80">
                                <IconMail className="size-3.5 text-muted-foreground" />
                                {user.emailId}
                              </span>
                            </TableCell>

                            <TableCell className="py-3.5">
                              {(user.roles ?? []).length === 0 ? (
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-border/60 text-xs text-muted-foreground"
                                >
                                  No roles assigned
                                </Badge>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {visibleRoles.map((roleValue) => {
                                    const role = roleByValue[roleValue];
                                    const roleColor =
                                      roleColorByValue[roleValue] ??
                                      ROLE_COLORS[0];

                                    return (
                                      <Badge
                                        key={`${user.id}-${roleValue}`}
                                        variant="secondary"
                                        className={cn(
                                          "max-w-full truncate rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold",
                                          roleColor.bg,
                                          roleColor.icon
                                        )}
                                      >
                                        {role?.label ?? roleValue}
                                      </Badge>
                                    );
                                  })}
                                  {extraRoleCount > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="rounded-full px-2.5 py-0.5 text-[11px]"
                                    >
                                      +{extraRoleCount} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </TableCell>

                            <TableCell className="py-3.5 text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <span className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                                    <IconAdjustmentsHorizontal className="size-3.5 text-primary" />
                                  </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-52 rounded-xl border-border/60 p-1.5 shadow-lg"
                                >
                                  <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                    User Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => beginUserEdit(user)}
                                    className="cursor-pointer rounded-lg px-2.5 py-2 focus:bg-primary/10 focus:text-foreground"
                                  >
                                    <span className="mr-2 inline-flex size-6 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                                      <IconEdit className="size-3.5 text-primary" />
                                    </span>
                                    <span className="font-medium">
                                      Edit User
                                    </span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer rounded-lg px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => removeUser(user.id)}
                                  >
                                    <span className="mr-2 inline-flex size-6 items-center justify-center rounded-md border border-destructive/20 bg-destructive/10">
                                      <IconTrash className="size-3.5" />
                                    </span>
                                    <span className="font-medium">
                                      Remove User
                                    </span>
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
                itemLabel="members"
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="pb-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <IconUsers className="size-4.5 text-primary" />
              </span>
              <DialogTitle className="text-xl">
                {editingUserId ? "Update User Access" : "Invite New User"}
              </DialogTitle>
            </div>
            <DialogDescription>
              Add member details and assign one or more roles for access
              control.
            </DialogDescription>
          </DialogHeader>

          <Form {...userForm}>
            <form
              onSubmit={userForm.handleSubmit(handleUserSubmit)}
              className="grid gap-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={userForm.control}
                  name="firstName"
                  rules={{
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters.",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name
                        <RequiredMark />
                      </FormLabel>
                      <div className="group relative">
                        <IconUser className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <FormControl>
                          <Input
                            placeholder="e.g. Priya"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="lastName"
                  rules={{
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters.",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name
                        <RequiredMark />
                      </FormLabel>
                      <div className="group relative">
                        <IconUser className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <FormControl>
                          <Input
                            placeholder="e.g. Shah"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="emailId"
                  rules={{
                    required: "Email ID is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email ID",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>
                        Email ID
                        <RequiredMark />
                      </FormLabel>
                      <div className="group relative">
                        <IconMail className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <FormControl>
                          <Input
                            placeholder="priya.shah@nexflow.com"
                            type="email"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={userForm.control}
                name="roles"
                rules={{
                  validate: (value) =>
                    value?.length > 0 || "At least one role must be selected",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Roles
                      <RequiredMark />
                    </FormLabel>
                    <div className="border border-border/50 bg-muted/15 p-3">
                      <FormControl>
                        <RoleMultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={availableRoles}
                          isLoading={rolesLoading || rolesFetching}
                          emptyMessage={
                            rolesError
                              ? "Unable to load role catalog."
                              : "No roles found."
                          }
                        />
                      </FormControl>
                      {selectedRolePreview.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedRolePreview.map((role, index) => {
                            const color =
                              ROLE_COLORS[index % ROLE_COLORS.length];
                            return (
                              <Badge
                                key={role.value}
                                variant="secondary"
                                className={cn(
                                  "rounded-full border-transparent px-2.5 py-1 text-[11px] font-semibold",
                                  color.bg,
                                  color.icon
                                )}
                              >
                                {role.label}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <FormDescription className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                      Search by role name, then assign one or more roles to this
                      user.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/40 pt-5">
                <p className="text-[11px] text-muted-foreground">
                  Roles selected:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedRoleValues.length}
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsUserModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2 shadow-sm">
                    {editingUserId ? "Save User" : "Create User"}
                    {!editingUserId && <IconPlus className="size-4" />}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Team;
