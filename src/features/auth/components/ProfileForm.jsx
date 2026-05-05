import { useState } from "react";
import { useForm } from "react-hook-form";
import StatusCallout from "@/components/common/StatusCallout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RequiredMark from "@/components/common/RequiredMark";
import {
  IconLoader,
  IconMail,
  IconPencilCheck,
  IconUser,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUpdateProfileMutation } from "../api/authApi";

const ProfileForm = ({ user }) => {
  const [profileStatus, setProfileStatus] = useState(null);
  const profileForm = useForm({
    mode: "onBlur",
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
    },
  });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleProfileSave = async (values) => {
    setProfileStatus(null);
    try {
      const response = await updateProfile(values).unwrap();
      const { message } = response;
      setProfileStatus({
        variant: "success",
        title: "Saved",
        message,
      });
    } catch (error) {
      setProfileStatus({
        variant: "error",
        title: "Error",
        message: error.message || "Failed to update profile.",
      });
    }
  };

  return (
    <>
      {profileStatus && (
        <StatusCallout
          variant={profileStatus.variant}
          title={profileStatus.title}
          message={profileStatus.message}
          className="mb-4"
          onDismiss={() => setProfileStatus(null)}
          duration={5000}
        />
      )}

      <Form {...profileForm}>
        <form
          className="grid gap-4"
          onSubmit={profileForm.handleSubmit(handleProfileSave)}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={profileForm.control}
              name="firstName"
              rules={{
                required: "First name is required.",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters.",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    First Name
                    <RequiredMark />
                  </FormLabel>
                  <div className="relative">
                    <IconUser className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="First Name"
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
              control={profileForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Last Name
                  </FormLabel>
                  <div className="relative">
                    <IconUser className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        className="pl-9"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={profileForm.control}
            name="emailId"
            disabled
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">
                  Email
                  <RequiredMark />
                </FormLabel>
                <div className="relative">
                  <IconMail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-9"
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

export default ProfileForm;
