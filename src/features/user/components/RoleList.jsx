import { useMemo, useState } from "react";

import DataErrorState from "@/components/common/DataErrorState";
import DataGridLoading from "@/components/common/DataGridLoading";
import EmptyState from "@/components/common/EmptyState";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { ROLE_COLORS } from "../constants/user.contants";
import { clampPage, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconDotsVertical,
  IconEdit,
  IconShieldCheck,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PermissionChip from "./PermissionChip";
import PaginationFooter from "@/components/common/PaginationFooter";
import { useDeleteRoleMutation } from "../api/roleApi";
import { toast } from "sonner";

const RoleList = ({ roleResponse, searchQuery, beginRoleEdit }) => {
  const [roleCurrentPage, setRoleCurrentPage] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const {
    isLoading,
    isFetching,
    isError,
    refetch,
    data: roles = [],
  } = roleResponse || {};
  const rolesPerPage = 3;
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const roleColorByIndex = useMemo(
    () =>
      roles.reduce(
        (acc, r, i) => ({
          ...acc,
          [r._id]: ROLE_COLORS[i % ROLE_COLORS.length],
        }),
        {}
      ),
    [roles]
  );

  const filteredRoles = useMemo(() => {
    const q = String(searchQuery ?? "").toLowerCase();
    return roles.filter((r) =>
      [r.name, r.description].some((val) => val?.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  const totalRolePages = Math.max(
    1,
    Math.ceil(filteredRoles.length / rolesPerPage)
  );
  const activeRolePage = clampPage(roleCurrentPage, totalRolePages);

  const paginatedRoles = useMemo(() => {
    const start = (activeRolePage - 1) * rolesPerPage;
    return filteredRoles.slice(start, start + rolesPerPage);
  }, [filteredRoles, activeRolePage, rolesPerPage]);

  const askDeleteRole = (role) => {
    setRoleToDelete(role);
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete?._id) return;

    try {
      const response = await deleteRole(roleToDelete._id).unwrap();
      toast.success(
        response?.message ||
          `${roleToDelete.name || "Role"} deleted successfully.`
      );
      setRoleToDelete(null);
      setRoleCurrentPage(1);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          `Unable to delete ${roleToDelete.name || "role"} right now.`
      );
    }
  };

  return (
    <>
      <div className="p-5 sm:p-6">
        {isLoading || isFetching ? (
          <DataGridLoading count={rolesPerPage} />
        ) : isError ? (
          <DataErrorState
            title="Unable to load roles"
            description="We could not fetch roles at the moment. Please retry."
            onRetry={refetch}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedRoles.length === 0 ? (
              <div className="col-span-full flex h-48 items-center justify-center">
                <EmptyState
                  title="No roles found"
                  description="No role matches your current search. Try a different keyword."
                  compact
                />
              </div>
            ) : (
              paginatedRoles.map((role) => {
                const color = roleColorByIndex[role._id] ?? ROLE_COLORS[0];
                return (
                  <Card
                    key={role._id}
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
                              {role.userCount} Assigned User
                              {role.userCount !== 1 && "s"}
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
                              className="cursor-pointer focus:text-white"
                            >
                              <IconEdit className="mr-2 size-4" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => askDeleteRole(role)}
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
                        {role.description || "No description added yet."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <PermissionChip
                            key={permission}
                            permission={permission}
                          />
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
        )}
      </div>
      <PaginationFooter
        currentPage={activeRolePage}
        totalPages={totalRolePages}
        totalItems={filteredRoles.length}
        itemsPerPage={rolesPerPage}
        itemLabel="roles"
        onPageChange={(nextPage) =>
          setRoleCurrentPage(clampPage(nextPage, totalRolePages))
        }
      />

      <ConfirmationDialog
        open={Boolean(roleToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setRoleToDelete(null);
          }
        }}
        title="Delete this role?"
        description={`This will permanently remove "${
          roleToDelete?.name || "this role"
        }". Members with this role may lose assigned access.`}
        confirmLabel="Delete Role"
        onConfirm={confirmDeleteRole}
        isLoading={isDeleting}
      />
    </>
  );
};

export default RoleList;
