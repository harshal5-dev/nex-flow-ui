import { useMemo, useState } from "react";
import DataErrorState from "@/components/common/DataErrorState";
import DataTableLoading from "@/components/common/DataTableLoading";
import EmptyState from "@/components/common/EmptyState";
import TableHeadLabel from "@/components/common/TableHeadLabel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconAdjustmentsHorizontal,
  IconEdit,
  IconMail,
  IconShieldCheck,
  IconUserCheck,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useGetUsersQuery } from "../api/userApi";
import { clampPage, cn, getUserFullName, hasAnyPermission } from "@/lib/utils";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaginationFooter from "@/components/common/PaginationFooter";
import { ROLE_COLORS } from "../constants/user.contants";
import { PERMISSIONS } from "@/constant/global";

const USER_STATUS_STYLES = {
  INVITED: "border-info/30 bg-info/10 text-info",
  ACTIVE: "border-success/30 bg-success/10 text-success",
  DISABLED: "border-warning/30 bg-warning/12 text-warning-foreground",
  SUSPENDED: "border-destructive/30 bg-destructive/10 text-destructive",
};

const normalizeUserStatus = (status) => {
  const normalizedStatus = String(status ?? "").toUpperCase();
  if (USER_STATUS_STYLES[normalizedStatus]) {
    return normalizedStatus;
  }
  return "INVITED";
};

const UserList = ({ searchQuery, beginUserEdit, removeUser, permissions }) => {
  const userResponse = useGetUsersQuery();

  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const {
    data: users = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = userResponse || {};
  const usersPerPage = 4;

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      const roleLabelText = (user.roles ?? [])
        .map((role) => role.name)
        .join(" ")
        .toLowerCase();

      return [
        user.firstName,
        user.lastName,
        getUserFullName(user),
        user.emailId,
        roleLabelText,
      ].some((text) =>
        String(text ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
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

  return (
    <>
      <div className="w-full overflow-auto">
        {isLoading || isFetching ? (
          <DataTableLoading rows={usersPerPage} columns={6} />
        ) : isError ? (
          <div className="p-4">
            <DataErrorState
              title="Unable to load users"
              description="We could not fetch users at the moment. Please retry."
              onRetry={refetch}
            />
          </div>
        ) : (
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
                  <TableHeadLabel Icon={IconUserCheck} label="Status" />
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
                  <TableCell colSpan={6} className="h-48 text-center">
                    <EmptyState message="No users match your criteria." />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => {
                  const visibleRoles = (user.roles ?? []).slice(0, 2);
                  const extraRoleCount =
                    (user.roles ?? []).length - visibleRoles.length;
                  const userStatus = normalizeUserStatus(user.status);

                  return (
                    <TableRow
                      key={user._id}
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
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
                            USER_STATUS_STYLES[userStatus]
                          )}
                        >
                          {userStatus}
                        </Badge>
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
                            {visibleRoles.map((role, index) => {
                              const roleColor =
                                ROLE_COLORS[index % ROLE_COLORS.length] ??
                                ROLE_COLORS[0];

                              return (
                                <Badge
                                  key={`${user.id}-${role._id}`}
                                  variant="secondary"
                                  className={cn(
                                    "max-w-full truncate rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold",
                                    roleColor.bg,
                                    roleColor.icon
                                  )}
                                >
                                  {role.name}
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
                        {hasAnyPermission(permissions, [
                          PERMISSIONS.MANAGE_USERS,
                        ]) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md border border-primary/20 bg-primary/10 dark:bg-primary/90">
                                <IconAdjustmentsHorizontal className="size-3.5 text-primary dark:text-foreground" />
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
                                className="cursor-pointer rounded-lg px-2.5 py-2 focus:bg-primary/10 focus:text-foreground dark:focus:bg-primary/25"
                              >
                                <span className="mr-2 inline-flex size-6 items-center justify-center rounded-md border border-primary/20 bg-primary/10 dark:bg-primary/75">
                                  <IconEdit className="size-3.5 text-primary dark:text-foreground" />
                                </span>
                                <span className="font-medium">Edit User</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer rounded-lg px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => removeUser(user)}
                              >
                                <span className="mr-2 inline-flex size-6 items-center justify-center rounded-md border border-destructive/20 bg-destructive/10">
                                  <IconTrash className="size-3.5" />
                                </span>
                                <span className="font-medium">Remove User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
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
    </>
  );
};

export default UserList;
