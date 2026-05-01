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
import SignupForm from "./SignupForm";

const signupHighlights = [
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

const Signup = () => {
  return (
    <AuthPageShell
      badge="Create Workspace"
      title="Launch your multi-tenant project management workspace with confidence."
      description="Create your account and start orchestrating projects and tasks from a modern, scalable platform."
      highlights={signupHighlights}
    >
      <Card className="w-full max-w-md animate-in rounded-2xl border-border/50 bg-card/90 p-0 shadow-xl backdrop-blur-sm duration-500 fade-in slide-in-from-bottom-3">
        {/* Top gradient accent line */}
        <div className="h-1 rounded-t-2xl bg-linear-to-r from-primary/40 via-primary to-primary/40" />

        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create workspace
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Set up your account and start your first workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-4">
          <SignupForm />
        </CardContent>

        <CardFooter className="justify-center px-6 pb-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPageShell>
  );
};

export default Signup;
