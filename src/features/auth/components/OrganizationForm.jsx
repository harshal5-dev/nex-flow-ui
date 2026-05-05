import RequiredMark from "@/components/common/RequiredMark";
import StatusCallout from "@/components/common/StatusCallout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  IconBuildingSkyscraper,
  IconEdit,
  IconLoader,
  IconPencilCheck,
} from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateOrganizationMutation } from "../api/authApi";

const OrganizationForm = ({ user }) => {
  const [orgStatus, setOrgStatus] = useState(null);
  const orgForm = useForm({
    mode: "onBlur",
    defaultValues: {
      name: user.tenant.name,
      description: user.tenant.description,
    },
  });
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const handleOrgSave = async (values) => {
    setOrgStatus(null);
    try {
      const response = await updateOrganization(values).unwrap();
      const { message } = response;
      setOrgStatus({
        variant: "success",
        title: "Saved",
        message,
      });
    } catch (error) {
      setOrgStatus({
        variant: "error",
        title: "Error",
        message: error.message || "Failed to update organization.",
      });
    }
  };

  return (
    <>
      {orgStatus && (
        <StatusCallout
          variant={orgStatus.variant}
          title={orgStatus.title}
          message={orgStatus.message}
          className="mb-4"
          onDismiss={() => setOrgStatus(null)}
          duration={5000}
        />
      )}

      <Form {...orgForm}>
        <form
          className="grid gap-4"
          onSubmit={orgForm.handleSubmit(handleOrgSave)}
          noValidate
        >
          <FormField
            control={orgForm.control}
            name="name"
            rules={{
              required: "Organization name is required.",
              minLength: {
                value: 2,
                message: "Must be at least 2 characters.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">
                  Organization Name
                  <RequiredMark />
                </FormLabel>
                <div className="relative">
                  <IconBuildingSkyscraper className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <FormControl>
                    <Input
                      placeholder="Organization Name"
                      className="pl-9"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          <FormField
            control={orgForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">
                  Description
                </FormLabel>
                <div className="relative">
                  <IconEdit className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
                  <FormControl>
                    <Textarea
                      className="pl-9"
                      placeholder="Brief description about your organization..."
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          <Separator className="my-1 bg-border/40" />

          <div className="flex items-center">
            <Button type="submit" className="gap-1.5" disabled={isLoading}>
              {isLoading ? (
                <>
                  <IconLoader className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update
                  <IconPencilCheck className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default OrganizationForm;
