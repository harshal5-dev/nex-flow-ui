import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  IconCircleCheck,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";

import AuthPageShell from "@/components/common/auth-page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const registerHighlights = [
  {
    title: "Fast Tenant Setup",
    description:
      "Create isolated workspaces and organization context in minutes.",
  },
  {
    title: "Team and Role Mapping",
    description:
      "Invite members and set permissions for structured collaboration.",
  },
  {
    title: "Execution-Ready Workflow",
    description:
      "Start tracking projects and task progress immediately after signup.",
  },
];

function RequiredMark() {
  return <span className="ml-1 text-destructive">*</span>;
}

const Register = () => {
  const form = useForm({
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const handleSubmit = (values) => {
    console.log("Register form submit:", values);
  };

  return (
    <AuthPageShell
      badge="Create Workspace"
      title="Launch your multi-tenant project management workspace with confidence."
      description="Create your account, define your organization setup, and start orchestrating projects and tasks from a modern, scalable platform."
      highlights={registerHighlights}
    >
      <Card className="w-full max-w-md animate-in border-border/70 bg-card/85 shadow-lg backdrop-blur duration-700 fade-in slide-in-from-right-4">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create your account and start your first workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
              noValidate
            >
              <p className="text-xs text-muted-foreground">
                Fields marked <span className="text-destructive">*</span> are
                required.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: "First name is required." }}
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
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
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

              <Button type="submit" size="lg" className="w-full">
                Create Workspace
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPageShell>
  );
};

export default Register;
