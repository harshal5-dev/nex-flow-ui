import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clampPage, cn } from "@/lib/utils";
import { ROLE_COLORS } from "../constants/user.contants";
import EmptyState from "@/components/common/EmptyState";
import DataErrorState from "@/components/common/DataErrorState";
import DataGridLoading from "@/components/common/DataGridLoading";
import {
  IconChecklist,
  IconDotsVertical,
  IconEdit,
  IconPlus,
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
import PermissionChip from "../components/PermissionChip";
import PaginationFooter from "@/components/common/PaginationFooter";
import { useGetPermissionsQuery, useGetRolesQuery } from "../api/roleApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getPermissionLabel } from "../lib/user.utils";
import ManageRoleForm from "../components/ManageRoleForm";

const Role = ({ searchQuery }) => {
  const [roleCurrentPage, setRoleCurrentPage] = useState(1);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [localRoles, setLocalRoles] = useState([]);
  const [deletedRoleIds, setDeletedRoleIds] = useState([]);
  const [roleDraftsById, setRoleDraftsById] = useState({});
  const rolesPerPage = 3;

  const {
    data: rolesData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetRolesQuery();
  const permissionResponse = useGetPermissionsQuery();
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    isFetching: permissionsFetching,
    isError: permissionsError,
  } = permissionResponse;

  const roleForm = useForm({
    mode: "onBlur",
    defaultValues: {
      id: "",
      name: "",
      description: "",
      permissions: [],
    },
  });

  const apiRoles = useMemo(
    () =>
      (Array.isArray(rolesData) ? rolesData : []).map((role) => ({
        _id: role?._id,
        name: role?.name ?? "Untitled Role",
        description: role?.description ?? "",
        code: role?.code ?? "",
        permissions: Array.isArray(role?.permissions) ? role.permissions : [],
        userCount: Number.isFinite(role?.userCount) ? role.userCount : 0,
      })),
    [rolesData]
  );

  const roles = useMemo(() => {
    const visibleApiRoles = apiRoles
      .filter((role) => !deletedRoleIds.includes(role._id))
      .map((role) => roleDraftsById[role._id] ?? role);

    return [...localRoles, ...visibleApiRoles];
  }, [apiRoles, deletedRoleIds, localRoles, roleDraftsById]);

  const permissionOptions = useMemo(() => {
    const catalogPermissions = Array.isArray(permissionsData)
      ? permissionsData
      : [];
    const usedPermissions = roles.flatMap((role) =>
      Array.isArray(role.permissions) ? role.permissions : []
    );

    const mergedPermissions = Array.from(
      new Set([...catalogPermissions, ...usedPermissions])
    );

    return mergedPermissions.filter(Boolean).map((permission) => ({
      value: permission,
      label: getPermissionLabel(permission),
    }));
  }, [permissionsData, roles]);

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

  const openCreateRoleModal = () => {
    roleForm.reset({ id: "", name: "", description: "", permissions: [] });
    setIsRoleModalOpen(true);
  };

  const beginRoleEdit = (role) => {
    roleForm.reset({
      id: role._id,
      name: role.name,
      description: role.description ?? "",
      permissions: role.permissions ?? [],
    });
    setIsRoleModalOpen(true);
  };

  const removeRole = (id) => {
    setLocalRoles((currentRoles) =>
      currentRoles.filter((role) => role._id !== id)
    );
    setDeletedRoleIds((currentIds) =>
      currentIds.includes(id) ? currentIds : [...currentIds, id]
    );
    setRoleDraftsById((currentDrafts) => {
      const { [id]: removedDraft, ...remainingDrafts } = currentDrafts;
      void removedDraft;
      return remainingDrafts;
    });
  };

  const editingRoleId = useWatch({ control: roleForm.control, name: "id" });

  return (
    <>
      <Card className="overflow-hidden border-border/50 bg-card/60 shadow-sm backdrop-blur">
        <div className="border-b border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-tight">
                Role Directory
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {roles.length} roles
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  <IconChecklist className="mr-1 size-3.5" />
                  {permissionsLoading || permissionsFetching
                    ? "Loading permissions..."
                    : `${permissionOptions.length} permissions`}
                </Badge>
                {permissionsError && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-destructive/30 text-destructive"
                  >
                    Permission catalog unavailable
                  </Badge>
                )}
              </div>
            </div>
            <Button
              type="button"
              onClick={openCreateRoleModal}
              className="shrink-0 gap-1.5"
            >
              <IconPlus className="size-4" />
              <span className="hidden sm:inline">Add Role</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
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
                              >
                                <IconEdit className="mr-2 size-4" />
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => removeRole(role._id)}
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
      </Card>

      {/* ── Add / Edit Role Dialog ─────────────────────────────────────────── */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="pb-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <IconShieldCheck className="size-4.5 text-primary" />
              </span>
              <DialogTitle className="text-xl">
                {editingRoleId ? "Update Role Definition" : "Create New Role"}
              </DialogTitle>
            </div>
            <DialogDescription>
              Configure role scope, responsibilities, and access controls for
              your organization.
            </DialogDescription>
          </DialogHeader>

          <ManageRoleForm
            setIsRoleModalOpen={setIsRoleModalOpen}
            permissionResponse={permissionResponse}
            roles={roles}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Role;
