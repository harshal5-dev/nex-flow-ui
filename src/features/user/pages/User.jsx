import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconPlus, IconUsers } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ManageUserForm from "../components/ManageUserForm";
import UserList from "../components/UserList";
import { hasAnyPermission } from "@/lib/utils";
import { PERMISSIONS } from "@/constant/global";
import { useDeleteUserMutation } from "../api/userApi";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";

const User = ({ searchQuery, permissions }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const isEditing = selectedUser !== null;
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const openCreateUserModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const beginUserEdit = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const removeUser = (user) => {
    setDeleteError("");
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    const userId = userToDelete?._id ?? userToDelete?.id;
    if (!userId) return;

    try {
      const response = await deleteUser(userId).unwrap();
      toast.success(
        response?.message ||
          `${userToDelete?.firstName || "User"} removed successfully.`
      );
      setUserToDelete(null);
      setDeleteError("");
    } catch (error) {
      setDeleteError(
        error?.data?.message ||
          `Unable to remove ${userToDelete?.firstName || "user"} right now.`
      );
    }
  };

  return (
    <>
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
              {hasAnyPermission(permissions, [PERMISSIONS.MANAGE_USERS]) && (
                <Button
                  type="button"
                  onClick={openCreateUserModal}
                  className="gap-1.5 px-3.5 shadow-sm"
                >
                  <IconPlus className="size-4" />
                  Add User
                </Button>
              )}
            </div>
          </div>
        </div>

        <UserList
          searchQuery={searchQuery}
          openCreateUserModal={openCreateUserModal}
          beginUserEdit={beginUserEdit}
          removeUser={removeUser}
          permissions={permissions}
        />
      </Card>

      {/* ── Add / Edit User Dialog ─────────────────────────────────────────── */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="pb-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <IconUsers className="size-4.5 text-primary" />
              </span>
              <DialogTitle className="text-xl">
                {isEditing ? "Update User Access" : "Invite New User"}
              </DialogTitle>
            </div>
            <DialogDescription>
              Add member details and assign one or more roles for access
              control.
            </DialogDescription>
          </DialogHeader>

          <ManageUserForm
            setIsUserModalOpen={setIsUserModalOpen}
            selectedUser={selectedUser}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setUserToDelete(null);
            setDeleteError("");
          }
        }}
        title="Remove this user?"
        description={`This will remove "${
          `${userToDelete?.firstName || ""} ${
            userToDelete?.lastName || ""
          }`.trim() || "this user"
        }" from the workspace.`}
        errorMessage={deleteError}
        confirmLabel="Remove User"
        onConfirm={confirmDeleteUser}
        isLoading={isDeleting}
      />
    </>
  );
};

export default User;
