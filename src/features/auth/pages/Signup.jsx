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
import SignupForm from "../components/SignupForm";

const signupHighlights = [
  {
    title: "Set Up in Minutes",
    description:
      "Create your account and have your workspace ready to use right away.",
  },
  {
    title: "Invite Your Team",
    description:
      "Add members and assign Admin, Manager, or Developer roles with scoped permissions.",
  },
  {
    title: "Start Tracking",
    description:
      "Create projects and tasks and begin delivering work immediately after sign up.",
  },
];

const Signup = () => {
  return (
    <AuthPageShell
      badge="Get Started"
      title="Create your account and start managing your team & projects."
      description="Sign up to get access to team management, project tracking, and task workflows — all in one place."
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
