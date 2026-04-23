import { useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconLoader,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useSigninMutation } from "../authApi";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function RequiredMark() {
  return <span className="ml-1 text-destructive">*</span>;
}

const SigninForm = () => {
  const navigate = useNavigate();
  const [signin, { isLoading }] = useSigninMutation();
  const [serverState, setServerState] = useState({
    status: "idle",
    message: "",
    detail: "",
  });

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      emailId: "",
      password: "",
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
      emailId: values.emailId,
      password: values.password,
    };

    try {
      const response = await signin(payload).unwrap();

      setServerState({
        status: "success",
        message: response?.message || "Signed in successfully.",
        detail: "Redirecting to your workspace dashboard...",
      });

      setTimeout(() => {
        navigate("/app/dashboard");
      }, 850);
    } catch (error) {
      setServerState({
        status: "error",
        message:
          error?.data?.message ||
          "Unable to sign in with provided credentials.",
        detail: "Please check your email/password and try again.",
      });
    }
  };

  const isSubmitting = isLoading || serverState.status === "success";

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
      >
        {statusContent ? (
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
        ) : null}

        <fieldset disabled={isSubmitting} className="space-y-4">
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
                  Email
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="pl-9"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </fieldset>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <IconLoader className="animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SigninForm;
