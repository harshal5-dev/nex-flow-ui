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
      <Card className="w-full max-w-md animate-in border-border/70 bg-card/85 shadow-lg backdrop-blur duration-700 fade-in slide-in-from-right-4">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            We&apos;ll send an OTP to your email for secure verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link
              to="/signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
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
