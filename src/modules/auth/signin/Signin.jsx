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
      <Card className="w-full max-w-md animate-in border-border/70 bg-card/85 shadow-lg backdrop-blur duration-700 fade-in slide-in-from-right-4">
        <CardHeader>
          <CardTitle className="text-2xl">Signin</CardTitle>
          <CardDescription>
            Enter your credentials to access your Next Flow workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            New to Next Flow?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
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
