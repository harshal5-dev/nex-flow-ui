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
import { IconEdit, IconPlus, IconShieldCheck } from "@tabler/icons-react";
import { useForm, useWatch } from "react-hook-form";
import PermissionMultiSelect from "./PermissionMultiSelect";
import PermissionChip from "./PermissionChip";
import { useMemo } from "react";
import { getPermissionLabel } from "../lib/user.utils";
import { Button } from "@/components/ui/button";

const ManageRoleForm = ({ setIsRoleModalOpen, permissionResponse, roles }) => {
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

  const selectedRolePermissions =
    useWatch({ control: roleForm.control, name: "permissions" }) ?? [];
  const editingRoleId = useWatch({ control: roleForm.control, name: "id" });

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

  const handleRoleSubmit = (values) => {
    const isEditing = Boolean(values.id);
    const normalizedPermissions = Array.from(new Set(values.permissions));
    const payload = {
      ...values,
      _id: values.id || "",
      permissions: normalizedPermissions,
    };

    if (isEditing) {
      console.log(values, "value", payload);
    } else {
      console.log(values, "value", payload);
    }

    setIsRoleModalOpen(false);
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
              <div className="border border-border/50 bg-muted/15 p-3">
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
              onClick={() => setIsRoleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2 shadow-sm">
              {editingRoleId ? "Save Role" : "Create Role"}
              {!editingRoleId && <IconPlus className="size-4" />}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ManageRoleForm;
