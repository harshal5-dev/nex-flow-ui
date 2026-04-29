import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  IconLoader,
  IconLock,
  IconMail,
  IconLogin2,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useSigninMutation } from "../authApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusCallout from "@/components/ui/status-callout";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";

function RequiredMark() {
  return <span className="ml-1 text-destructive">*</span>;
}

const SigninForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signin, { isLoading }] = useSigninMutation();
  const [serverStatus, setServerStatus] = useState(null);

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      emailId: "",
      password: "",
    },
  });

  const dismissServerStatus = () => {
    setServerStatus(null);
  };

  const handleSubmit = async (values) => {
    form.clearErrors();
    setServerStatus(null);

    const payload = {
      emailId: values.emailId,
      password: values.password,
    };

    try {
      const response = await signin(payload).unwrap();

      const { message, data } = response;

      setServerStatus({
        variant: "success",
        title: "Signed in successfully",
        message,
      });

      dispatch(setCredentials(data));
      const from = location.state?.from?.pathname || "/app/dashboard";

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 850);
    } catch (error) {
      const { message, validationErrors } = error.data;
      const details = validationErrors
        ? Object.keys(validationErrors).map((field) => validationErrors[field])
        : [];

      setServerStatus({
        variant: "error",
        title: "Sign in failed",
        message,
        details,
      });
    }
  };

  const isSubmitting = isLoading || serverStatus?.variant === "success";

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
            className="mb-6"
          />
        )}

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
              onClick={() => navigate("/forgot-password")}
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
            <>
              Sign In
              <IconLogin2 className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SigninForm;
