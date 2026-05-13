import RequiredMark from "@/components/common/RequiredMark";
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
import { IconLoader, IconMail, IconPlus, IconUser } from "@tabler/icons-react";
import { useForm, useWatch } from "react-hook-form";
import RoleMultiSelect from "./RoleMultiSelect";
import { Badge } from "@/components/ui/badge";
import { ROLE_COLORS } from "../constants/user.contants";
import { Button } from "@/components/ui/button";
import { useGetRolesQuery } from "../api/roleApi";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useCreateUserMutation, useUpdateUserMutation } from "../api/userApi";
import { toast } from "sonner";

/**
 * Extract the _id from a role, which may come from the API as:
 *  - a string (already an _id)
 *  - an object { _id, name, ... }
 */
const toRoleId = (role) => {
  if (typeof role === "string") return role;
  return role?._id ?? role?.id ?? role?.value ?? "";
};

const resolveDefaultValues = (selectedUser) => ({
  id: selectedUser?.id ?? selectedUser?._id ?? "",
  firstName: selectedUser?.firstName ?? "",
  lastName: selectedUser?.lastName ?? "",
  emailId: selectedUser?.emailId ?? "",
  roles: Array.isArray(selectedUser?.roles)
    ? selectedUser.roles.map(toRoleId).filter(Boolean)
    : [],
});

const ManageUserForm = ({ setIsUserModalOpen, selectedUser }) => {
  const roleResponse = useGetRolesQuery();
  const {
    data: rolesData = [],
    isLoading: rolesLoading,
    isFetching: rolesFetching,
    isError: rolesError,
  } = roleResponse || {};

  const userForm = useForm({
    mode: "onBlur",
    defaultValues: resolveDefaultValues(selectedUser),
  });
  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation();
  const [submitError, setSubmitError] = useState("");
  const isSubmitting = creatingUser || updatingUser;

  const isEditing = Boolean(selectedUser?.id || selectedUser?._id);

  useEffect(() => {
    userForm.reset(resolveDefaultValues(selectedUser));
  }, [selectedUser, userForm]);

  // Pass raw API role objects directly — RoleMultiSelect normalizes internally
  const roleOptions = useMemo(
    () => (Array.isArray(rolesData) ? rolesData : []),
    [rolesData]
  );

  // Build a lookup by _id for preview badges
  const roleById = useMemo(
    () =>
      roleOptions.reduce((acc, role) => {
        const id = role?._id ?? role?.id;
        if (id) acc[id] = role;
        return acc;
      }, {}),
    [roleOptions]
  );

  const selectedRoleValues = useWatch({
    control: userForm.control,
    name: "roles",
    defaultValue: [],
  });

  const selectedRolePreview = useMemo(
    () => selectedRoleValues.map((roleId) => roleById[roleId]).filter(Boolean),
    [selectedRoleValues, roleById]
  );

  const handleUserSubmit = async (values) => {
    setSubmitError("");

    // values.roles is already an array of _id strings
    const payload = {
      ...values,
      id: values.id || "",
      roles: Array.from(new Set(values.roles ?? [])).filter(Boolean),
    };

    try {
      if (values.id) {
        const response = await updateUser(payload).unwrap();
        toast.success(
          response?.message ||
            `${values.firstName || "User"} updated successfully.`
        );
      } else {
        const response = await createUser({
          firstName: payload.firstName,
          lastName: payload.lastName,
          emailId: payload.emailId,
          roles: payload.roles,
        }).unwrap();
        toast.success(
          response?.message ||
            `${values.firstName || "User"} created successfully.`
        );
      }
      setIsUserModalOpen(false);
    } catch (error) {
      setSubmitError(
        error?.data?.message ||
          "Unable to save user right now. Please try again."
      );
    }
  };

  return (
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
                      placeholder="e.g. Smith"
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
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <div className="group relative">
                  <IconUser className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <FormControl>
                    <Input
                      placeholder="e.g. Miller"
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
            disabled={isEditing}
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
                      placeholder="smith.miller@nexflow.com"
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
              <div className="rounded-md border border-border/50 bg-muted/15 p-3">
                <FormControl>
                  <RoleMultiSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={roleOptions}
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
                      const color = ROLE_COLORS[index % ROLE_COLORS.length];
                      return (
                        <Badge
                          key={role._id ?? role.id}
                          variant="secondary"
                          className={cn(
                            "rounded-full border-transparent px-2.5 py-1 text-[11px] font-semibold",
                            color.bg,
                            color.icon
                          )}
                        >
                          {role.name ?? role.label}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              <FormDescription className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Search by role name, then assign one or more roles to this user.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError && (
          <p className="text-xs font-medium text-destructive">{submitError}</p>
        )}

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
              disabled={isSubmitting}
              onClick={() => setIsUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2 shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <IconLoader className="size-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing ? "Save User" : "Create User"}
                  {!isEditing && <IconPlus className="size-4" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ManageUserForm;
