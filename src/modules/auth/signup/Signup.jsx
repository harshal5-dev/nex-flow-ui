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
      <Card className="w-full max-w-md animate-in border-border/70 bg-card/85 shadow-lg backdrop-blur duration-700 fade-in slide-in-from-right-4">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create your account and start your first workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
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

export default Signup;
