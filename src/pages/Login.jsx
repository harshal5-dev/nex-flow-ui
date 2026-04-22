import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

import AuthPageShell from "@/components/common/auth-page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      window.localStorage.setItem("nexflow:mock-auth", "true");
      navigate("/app/dashboard");
    }, 700);
  };

  return (
    <AuthPageShell
      badge="Welcome Back"
      title="Sign in to continue building and managing your tenant workspaces."
      description="Access your account to monitor project health, prioritize delivery, and collaborate across organizations in one modern control center."
      highlights={loginHighlights}
    >
      <Card className="w-full max-w-md animate-in border-border/70 bg-card/85 shadow-lg backdrop-blur duration-700 fade-in slide-in-from-right-4">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your Next Flow workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="login-email">Work Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Demo mode enabled. This will use mock login and open your
              application dashboard layout.
            </p>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/70" />
              </div>
              <p className="relative mx-auto w-fit bg-card px-2 text-xs text-muted-foreground">
                Or continue with
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
              >
                <IconBrandGoogle className="mr-1.5 size-4" />
                Google
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
              >
                <IconBrandGithub className="mr-1.5 size-4" />
                GitHub
              </Button>
            </div>
          </form>
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

export default Login;
