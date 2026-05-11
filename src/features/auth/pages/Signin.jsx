import { Link } from "react-router-dom";

import AuthPageShell from "@/components/common/AuthPageShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SigninForm from "../components/SigninForm";

const loginHighlights = [
  {
    title: "Team Management",
    description:
      "View and manage workspace members with Admin, Manager, and Developer roles.",
  },
  {
    title: "Project Tracking",
    description:
      "Monitor project health and progress from kickoff to completion.",
  },
  {
    title: "Task Workflows",
    description:
      "Assign, prioritize, and move tasks through clear delivery stages.",
  },
];

const Signin = () => {
  return (
    <AuthPageShell
      badge="Welcome Back"
      title="Sign in to manage your team, projects & tasks."
      description="Access your workspace to track project progress, assign tasks, and keep your team aligned — all from one place."
      highlights={loginHighlights}
    >
      <Card className="relative w-full max-w-md animate-in overflow-hidden rounded-2xl border-border/50 bg-card/92 p-0 shadow-xl backdrop-blur-sm duration-500 fade-in slide-in-from-bottom-3">
        <span className="pointer-events-none absolute -top-20 -right-8 size-48 rounded-full bg-primary/14 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-info/12 blur-3xl" />

        <div className="relative h-1 rounded-t-2xl bg-linear-to-r from-info/45 via-primary to-success/45" />

        <CardHeader className="relative px-6 pt-6 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your Next Flow workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative px-6 pb-4">
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
