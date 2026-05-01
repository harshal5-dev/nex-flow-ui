import { Link } from "react-router-dom";

import AuthPageShell from "@/components/common/auth-page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

const forgotPasswordHighlights = [
  {
    title: "Email Verification",
    description:
      "A 6-digit OTP is sent to your registered email address instantly.",
  },
  {
    title: "Secure Reset",
    description:
      "Verify your identity with the OTP and set a new password securely.",
  },
  {
    title: "Back in Seconds",
    description:
      "Regain access and return to managing your team and projects right away.",
  },
];

function ForgotPassword() {
  return (
    <AuthPageShell
      badge="Account Recovery"
      title="Recover your account with secure OTP verification."
      description="Enter your registered email to receive a one-time code and reset your password in seconds."
      highlights={forgotPasswordHighlights}
    >
      <Card className="w-full max-w-md animate-in rounded-2xl border-border/50 bg-card/90 p-0 shadow-xl backdrop-blur-sm duration-500 fade-in slide-in-from-bottom-3">
        {/* Top gradient accent line */}
        <div className="h-1 rounded-t-2xl bg-linear-to-r from-primary/40 via-primary to-primary/40" />

        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Reset password
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your email to receive a secure OTP code.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-4">
          <ForgotPasswordForm />
        </CardContent>

        <CardFooter className="justify-center px-6 pb-6">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link
              to="/signin"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPageShell>
  );
}

export default ForgotPassword;
