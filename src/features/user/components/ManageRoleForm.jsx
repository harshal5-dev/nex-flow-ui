import { useEffect, useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  IconEdit,
  IconLoader,
  IconPlus,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useForm, useWatch } from "react-hook-form";
import PermissionMultiSelect from "./PermissionMultiSelect";
import PermissionChip from "./PermissionChip";
import { getPermissionLabel } from "../lib/user.utils";
import { Button } from "@/components/ui/button";
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useUpdateRoleMutation,
} from "../api/roleApi";
import { toast } from "sonner";

const ManageRoleForm = ({ setIsRoleModalOpen, selectedRole }) => {
  const permissionResponse = useGetPermissionsQuery();
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    isFetching: permissionsFetching,
    isError: permissionsError,
  } = permissionResponse;
  const isEditing = Boolean(selectedRole?._id);

  const [createRole, { isLoading: creatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updatingRole }] = useUpdateRoleMutation();
  const [submitError, setSubmitError] = useState("");
  const isSubmitting = creatingRole || updatingRole;

  const roleForm = useForm({
    mode: "onBlur",
    defaultValues: {
      id: selectedRole?._id ?? "",
      name: selectedRole?.name ?? "",
      description: selectedRole?.description ?? "",
      permissions: selectedRole?.permissions ?? [],
    },
  });

  useEffect(() => {
    roleForm.reset({
      id: selectedRole?._id ?? "",
      name: selectedRole?.name ?? "",
      description: selectedRole?.description ?? "",
      permissions: selectedRole?.permissions ?? [],
    });
  }, [roleForm, selectedRole]);

  const selectedRolePermissions =
    useWatch({ control: roleForm.control, name: "permissions" }) ?? [];

  const permissionOptions = useMemo(() => {
    const catalogPermissions = Array.isArray(permissionsData)
      ? permissionsData
      : [];

    return catalogPermissions.filter(Boolean).map((permission) => ({
      value: permission,
      label: getPermissionLabel(permission),
    }));
  }, [permissionsData]);

  const handleRoleSubmit = async (values) => {
    setSubmitError("");
    const isEditing = Boolean(values.id);
    const normalizedPermissions = Array.from(new Set(values.permissions));
    const payload = {
      ...values,
      id: values.id || "",
      permissions: normalizedPermissions,
    };

    try {
      if (isEditing) {
        const response = await updateRole(payload).unwrap();
        toast.success(
          response?.message || `${values.name || "Role"} updated successfully.`
        );
      } else {
        const response = await createRole({
          name: payload.name,
          description: payload.description,
          permissions: payload.permissions,
        }).unwrap();
        toast.success(
          response?.message || `${values.name || "Role"} created successfully.`
        );
      }
      setIsRoleModalOpen(false);
    } catch (error) {
      setSubmitError(
        error?.data?.message ||
          "Unable to save role right now. Please try again."
      );
    }
  };

  return (
    <Form {...roleForm}>
      <form
        onSubmit={roleForm.handleSubmit(handleRoleSubmit)}
        className="grid gap-5"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={roleForm.control}
            name="name"
            rules={{
              required: "Role name is required",
              minLength: {
                value: 2,
                message: "Role name must be at least 2 characters.",
              },
            }}
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  Role Name
                  <RequiredMark />
                </FormLabel>
                <div className="group relative">
                  <IconShieldCheck className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <FormControl>
                    <Input
                      placeholder="e.g. Product Manager"
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
            control={roleForm.control}
            name="description"
            rules={{
              minLength: {
                value: 10,
                message: "Description should be at least 10 characters.",
              },
            }}
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Description</FormLabel>
                <div className="group relative">
                  <IconEdit className="pointer-events-none absolute top-3 left-3.5 size-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <FormControl>
                    <Textarea
                      placeholder="Summarize this role's mission, ownership, and expectations."
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
          control={roleForm.control}
          name="permissions"
          rules={{
            validate: (value) =>
              value?.length > 0 || "At least one permission is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Permissions
                <RequiredMark />
              </FormLabel>
              <div className="rounded-md border border-border/50 bg-muted/15 p-3">
                <FormControl>
                  <PermissionMultiSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={permissionOptions}
                    isLoading={permissionsLoading || permissionsFetching}
                    emptyMessage={
                      permissionsError
                        ? "Unable to load permission catalog."
                        : "No permissions found."
                    }
                  />
                </FormControl>
                {field.value?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value.map((permission) => (
                      <PermissionChip
                        key={permission}
                        permission={permission}
                      />
                    ))}
                  </div>
                )}
              </div>
              <FormDescription className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Search by label or key, then choose multiple permissions.
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
            Permissions selected:{" "}
            <span className="font-semibold text-foreground">
              {selectedRolePermissions.length}
            </span>
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => setIsRoleModalOpen(false)}
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
                  {isEditing ? "Save Role" : "Create Role"}
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

export default ManageRoleForm;
