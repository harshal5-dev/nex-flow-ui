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
import ForgotPasswordForm from "./ForgotPasswordForm";

const forgotPasswordHighlights = [
  {
    title: "Secure Recovery",
    description:
      "OTP-based verification keeps your account recovery flow protected.",
  },
  {
    title: "Fast Verification",
    description:
      "Receive code on your registered email and confirm in seconds.",
  },
  {
    title: "Back to Productivity",
    description:
      "Reset password and return to project delivery without friction.",
  },
];

function ForgotPassword() {
  return (
    <AuthPageShell
      badge="Account Recovery"
      title="Forgot your password? Recover access using email OTP verification."
      description="Enter your email to receive a one-time password, verify ownership, and reset credentials securely."
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
