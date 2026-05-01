import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconCircleCheck,
  IconLoader,
  IconLock,
  IconMail,
  IconUser,
  IconDesk,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";

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
import { useSignupMutation } from "../api/authApi";
import StatusCallout from "@/components/ui/status-callout";

function RequiredMark() {
  return <span className="ml-1 text-destructive">*</span>;
}

const SignupForm = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [serverStatus, setServerStatus] = useState(null);

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const dismissServerStatus = () => {
    setServerStatus(null);
  };

  const handleSubmit = async (values) => {
    form.clearErrors();
    setServerStatus(null);

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      emailId: values.emailId,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    try {
      const response = await signup(payload).unwrap();
      const { message } = response;

      setServerStatus({
        variant: "success",
        title: "Workspace created successfully!",
        message,
      });

      setTimeout(() => {
        navigate("/signin");
      }, 2000);

      form.reset({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });
    } catch (error) {
      const { message, validationErrors } = error.data;
      const details = validationErrors
        ? Object.keys(validationErrors).map((field) => validationErrors[field])
        : [];

      setServerStatus({
        variant: "error",
        title: "Could not create workspace",
        message:
          message || "Something went wrong while creating your workspace.",
        details,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
      >
        {serverStatus && (
          <StatusCallout
            variant={serverStatus.variant}
            title={serverStatus.title}
            message={serverStatus.message}
            details={serverStatus.details}
            onDismiss={dismissServerStatus}
            action={
              serverStatus?.variant === "success" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/signin")}
                  className="hover:border-success/30 hover:bg-success/10"
                >
                  Continue to sign in
                </Button>
              ) : null
            }
            className="mb-6"
          />
        )}

        <fieldset disabled={isLoading} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
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
                  <FormLabel>
                    First Name
                    <RequiredMark />
                  </FormLabel>
                  <div className="relative">
                    <IconUser className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="John"
                        autoComplete="given-name"
                        className="pl-9"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name
                    <span className="ml-1 text-xs text-muted-foreground">
                      (Optional)
                    </span>
                  </FormLabel>
                  <div className="relative">
                    <IconUser className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        autoComplete="family-name"
                        className="pl-9"
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
            control={form.control}
            name="emailId"
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email ID
                  <RequiredMark />
                </FormLabel>
                <div className="relative">
                  <IconMail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="pl-9"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
                maxLength: {
                  value: 15,
                  message: "Password must be less than 15 characters.",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                    <RequiredMark />
                  </FormLabel>
                  <div className="relative">
                    <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create password"
                        autoComplete="new-password"
                        className="pl-9"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password.",
                validate: (value) =>
                  value === form.getValues("password") ||
                  "Passwords do not match.",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password
                    <RequiredMark />
                  </FormLabel>
                  <div className="relative">
                    <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        className="pl-9"
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
            control={form.control}
            name="acceptTerms"
            rules={{
              validate: (value) =>
                value || "You must agree to the terms and privacy policy.",
            }}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="size-4 rounded border-input bg-background accent-primary"
                    />
                  </FormControl>
                  <IconCircleCheck className="size-3.5 text-primary" />
                  <span>
                    I agree to the terms and privacy policy
                    <RequiredMark />
                  </span>
                </label>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="grid gap-2">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || serverStatus?.variant === "success"}
          >
            {isLoading ? (
              <>
                <IconLoader className="animate-spin" />
                Creating Workspace...
              </>
            ) : (
              <>
                Create Workspace
                <IconDesk className="ml-2 size-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
