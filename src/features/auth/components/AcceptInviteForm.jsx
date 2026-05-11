import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  IconEye,
  IconEyeOff,
  IconLoader,
  IconLock,
  IconSparkles,
} from "@tabler/icons-react";

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
import { useAcceptInviteMutation } from "../api/authApi";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { isStrongPassword } from "../lib/passwordStrength";

function getValidationDetails(validationErrors) {
  if (!validationErrors || typeof validationErrors !== "object") {
    return [];
  }

  return Object.values(validationErrors)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean)
    .map((value) => String(value));
}

const AcceptInviteForm = ({ token = "" }) => {
  const navigate = useNavigate();
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState(null);

  const hasToken = Boolean(token);

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({
    control: form.control,
    name: "password",
    defaultValue: "",
  });

  const dismissStatus = () => {
    setStatus(null);
  };

  const handleSubmit = async ({ password, confirmPassword }) => {
    form.clearErrors();
    setStatus(null);

    if (!hasToken) {
      setStatus({
        variant: "error",
        title: "Missing invitation token",
        message:
          "This invite link looks incomplete. Ask your admin to resend the invitation.",
      });
      return;
    }

    if (password !== confirmPassword) {
      form.setError("confirmPassword", {
        type: "validate",
        message: "Passwords do not match.",
      });
      return;
    }

    if (!isStrongPassword(password)) {
      form.setError("password", {
        type: "validate",
        message: "Please satisfy all password requirements.",
      });
      return;
    }

    try {
      const response = await acceptInvite({ token, password }).unwrap();
      setStatus({
        variant: "success",
        title: "Invitation accepted",
        message:
          response?.message ||
          "Your account has been activated. Redirecting to sign in...",
      });
      form.reset();

      setTimeout(() => {
        navigate("/signin", { replace: true });
      }, 1200);
    } catch (error) {
      setStatus({
        variant: "error",
        title: "Could not accept invitation",
        message:
          error?.data?.message ||
          "Your invitation may be invalid or expired. Please request a fresh invite.",
        details: getValidationDetails(error?.data?.validationErrors),
      });
    }
  };

  const isSubmitting = isLoading || status?.variant === "success";

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
      >
        <input
          type="text"
          name="username"
          autoComplete="username"
          defaultValue=""
          className="sr-only"
          tabIndex={-1}
        />

        {!hasToken && (
          <StatusCallout
            variant="warning"
            title="Invalid invitation link"
            message="Token is missing from this URL. Please use the full invite link from your email."
          />
        )}

        {status && (
          <StatusCallout
            variant={status.variant}
            title={status.title}
            message={status.message}
            details={status.details}
            onDismiss={dismissStatus}
          />
        )}

        <fieldset disabled={isSubmitting || !hasToken} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "New password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  New Password
                  <RequiredMark />
                </FormLabel>
                <div className="relative">
                  <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create your new password"
                      autoComplete="new-password"
                      className="pr-10 pl-9"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <IconEyeOff className="size-3.5" />
                    ) : (
                      <IconEye className="size-3.5" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your new password.",
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      className="pr-10 pl-9"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff className="size-3.5" />
                    ) : (
                      <IconEye className="size-3.5" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <PasswordStrengthIndicator passwordValue={passwordValue} />
        </fieldset>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || !hasToken}
        >
          {isSubmitting ? (
            <>
              <IconLoader className="animate-spin" />
              Accepting invitation...
            </>
          ) : (
            <>
              Accept Invitation
              <IconSparkles className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AcceptInviteForm;
