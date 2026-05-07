import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  IconCircleCheck,
  IconLoader,
  IconLock,
  IconMail,
} from "@tabler/icons-react";

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
import StatusCallout from "@/components/common/StatusCallout";
import {
  useForgotPasswordMutation,
  useVerifyResetPasswordMutation,
} from "../api/authApi";
import RequiredMark from "@/components/common/RequiredMark";

const OTP_RESEND_SECONDS = 30;

function maskEmail(emailId) {
  const [name = "", domain = ""] = String(emailId).split("@");

  if (!name || !domain) {
    return emailId;
  }

  const first = name.slice(0, 2);
  const maskedPart = "*".repeat(Math.max(2, name.length - 2));

  return `${first}${maskedPart}@${domain}`;
}

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [resendIn, setResendIn] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [verifyResetPassword, { isLoading: isVerifying }] =
    useVerifyResetPasswordMutation();
  const isSubmitting = isLoading || isVerifying;

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      emailId: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (step !== "verify" || resendIn <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setResendIn((previous) => previous - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [step, resendIn]);

  const dismissStatus = () => {
    setStatus(null);
  };

  const handleSendOtp = async ({ emailId }) => {
    form.clearErrors();
    setStatus(null);
    try {
      await forgotPassword({ emailId }).unwrap();
      setMaskedEmail(maskEmail(emailId));
      setStep("verify");
      setResendIn(OTP_RESEND_SECONDS);
      setStatus({
        variant: "success",
        title: "OTP sent",
        message: `A 6-digit verification code was sent to ${maskEmail(emailId)}.`,
      });
    } catch (error) {
      setStatus({
        variant: "error",
        title: "Error",
        message: error?.message || "Failed to send OTP. Please try again.",
      });
    }
  };

  const handleVerifyOtp = async ({
    otp,
    password,
    confirmPassword,
    emailId,
  }) => {
    form.clearErrors();
    setStatus(null);

    if (!/^\d{6}$/.test(otp)) {
      form.setError("otp", {
        type: "validate",
        message: "Enter a valid 6-digit OTP.",
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

    try {
      await verifyResetPassword({ otp, password, emailId });
      setStatus({
        variant: "success",
        title: "Password updated",
        message: "Your password was reset successfully.",
      });
      setTimeout(() => {
        navigate("/signin", { replace: true });
      }, 900);
    } catch (error) {
      const { data = {} } = error;
      setStatus({
        variant: "error",
        title: "Error",
        message: data.message || "Failed to reset password. Please try again.",
      });
    }
  };

  const handleSubmit = async (values) => {
    if (step === "email") {
      await handleSendOtp(values);
      return;
    }

    await handleVerifyOtp(values);
  };

  const handleResendOtp = async () => {
    if (resendIn > 0 || isSubmitting) {
      return;
    }
    await handleSendOtp(form.getValues());
  };

  const handleChangeEmail = () => {
    setStep("email");
    setResendIn(0);
    setMaskedEmail("");
    setStatus(null);
    form.setValue("otp", "");
    form.setValue("password", "");
    form.setValue("confirmPassword", "");
    form.clearErrors();
  };

  const isEmailStep = step === "email";

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
      >
        {status && (
          <StatusCallout
            variant={status.variant}
            title={status.title}
            message={status.message}
            details={status.details}
            onDismiss={dismissStatus}
          />
        )}

        {!isEmailStep && (
          <p className="text-xs text-muted-foreground">
            Verifying email: <span className="font-medium">{maskedEmail}</span>
          </p>
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
                      disabled={!isEmailStep}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEmailStep && (
            <>
              <FormField
                control={form.control}
                name="otp"
                rules={{
                  required: "OTP is required.",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter a valid 6-digit OTP.",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      OTP Code
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit OTP"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          type="password"
                          placeholder="Create new password"
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
                          placeholder="Confirm new password"
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
            </>
          )}
        </fieldset>

        <div className="grid gap-2">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <IconLoader className="animate-spin" />
                {isEmailStep ? "Sending OTP..." : "Verifying..."}
              </>
            ) : isEmailStep ? (
              "Send OTP"
            ) : (
              <>
                Verify OTP & Reset Password
                <IconCircleCheck className="ml-2 size-4" />
              </>
            )}
          </Button>

          {!isEmailStep && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleChangeEmail}
                disabled={isSubmitting}
              >
                Change Email
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={isSubmitting || resendIn > 0}
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
