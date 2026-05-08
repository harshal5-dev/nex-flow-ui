import { useState } from "react";
import { Card } from "@/components/ui/card";
import { IconPlus, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useGetPermissionsQuery, useGetRolesQuery } from "../api/roleApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ManageRoleForm from "../components/ManageRoleForm";
import RoleList from "../components/RoleList";

const Role = ({ searchQuery }) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const roleResponse = useGetRolesQuery();
  const { data: roles = [] } = roleResponse || {};
  const permissionResponse = useGetPermissionsQuery();

  const openCreateRoleModal = () => {
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const beginRoleEdit = (role) => {
    setIsRoleModalOpen(true);
    setSelectedRole(role);
  };

  return (
    <>
      <Card className="overflow-hidden border-border/50 bg-card/60 shadow-sm backdrop-blur">
        <div className="border-b border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-tight">
                Role Directory
              </p>
              <p className="text-xs text-muted-foreground">
                Manage roles and permissions
              </p>
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

        <RoleList
          roleResponse={roleResponse}
          searchQuery={searchQuery}
          beginRoleEdit={beginRoleEdit}
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
                {selectedRole ? "Update Role Definition" : "Create New Role"}
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
            selectedRole={selectedRole}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Role;
