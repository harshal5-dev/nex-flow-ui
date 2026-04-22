import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconLoader,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSignupMutation } from "../authApi";

function RequiredMark() {
  return <span className="ml-1 text-destructive">*</span>;
}

const SignupForm = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [serverState, setServerState] = useState({
    status: "idle",
    message: "",
    detail: "",
  });

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

  const statusContent = useMemo(() => {
    if (serverState.status === "success") {
      return {
        icon: IconCircleCheck,
        containerClass:
          "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        titleClass: "text-emerald-800 dark:text-emerald-200",
      };
    }

    if (serverState.status === "error") {
      return {
        icon: IconAlertTriangle,
        containerClass:
          "border-destructive/40 bg-destructive/10 text-destructive",
        titleClass: "text-destructive",
      };
    }

    return null;
  }, [serverState.status]);

  const handleSubmit = async (values) => {
    form.clearErrors();
    setServerState({ status: "idle", message: "", detail: "" });

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

      setServerState({
        status: "success",
        message,
        detail: "Redirecting to login page...",
      });

      setTimeout(() => {
        navigate("/login");
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
      const { message } = error.data;
      const detail = "Please try again in a moment.";

      setServerState({
        status: "error",
        message,
        detail,
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
        {statusContent && (
          <Card
            className={cn(
              "rounded-xl border p-3 shadow-none",
              statusContent.containerClass
            )}
          >
            <div className="flex items-start gap-2">
              <statusContent.icon className="mt-0.5 size-4 shrink-0" />
              <div className="space-y-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    statusContent.titleClass
                  )}
                >
                  {serverState.message}
                </p>
                {serverState.detail ? (
                  <p className="text-xs opacity-90">{serverState.detail}</p>
                ) : null}
              </div>
            </div>
          </Card>
        )}

        <p className="text-xs text-muted-foreground">
          Fields marked <span className="text-destructive">*</span> are
          required.
        </p>

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
                kMaxLength: {
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
            disabled={isLoading || serverState.status === "success"}
          >
            {isLoading || serverState.status === "success" ? (
              <>
                <IconLoader className="animate-spin" />
                Creating Workspace...
              </>
            ) : (
              "Create Workspace"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
