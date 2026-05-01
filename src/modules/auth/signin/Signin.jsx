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
import SigninForm from "./SigninForm";

const loginHighlights = [
  {
    title: "Secure Workspace Access",
    description:
      "Tenant-aware authentication with role-scoped workspace entry.",
  },
  {
    title: "Live Project Visibility",
    description:
      "Track assignments, priorities, and delivery status in real time.",
  },
  {
    title: "Unified Delivery Control",
    description:
      "Operate milestones, tasks, and team coordination from one place.",
  },
];

const Signin = () => {
  return (
    <AuthPageShell
      badge="Welcome Back"
      title="Sign in to continue building and managing your tenant workspaces."
      description="Access your account to monitor project health, prioritize delivery, and collaborate across organizations in one modern control center."
      highlights={loginHighlights}
    >
      <Card className="w-full max-w-md animate-in rounded-2xl border-border/50 bg-card/90 p-0 shadow-xl backdrop-blur-sm duration-500 fade-in slide-in-from-bottom-3">
        {/* Top gradient accent line */}
        <div className="h-1 rounded-t-2xl bg-linear-to-r from-primary/40 via-primary to-primary/40" />

        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your Next Flow workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-4">
          <SigninForm />
        </CardContent>

        <CardFooter className="justify-center px-6 pb-6">
          <p className="text-sm text-muted-foreground">
            New to Next Flow?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPageShell>
  );
};

export default Signin;
