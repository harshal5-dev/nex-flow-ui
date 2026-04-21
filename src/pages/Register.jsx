import { Link } from "react-router-dom";

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

const registerHighlights = [
  "Set up isolated tenant workspaces in minutes.",
  "Configure teams, permissions, and delivery workflows.",
  "Start tracking projects and task execution immediately.",
];

const Register = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthPageShell
      badge="Create Workspace"
      title="Launch your multi-tenant project management workspace with confidence."
      description="Create your account, define your organization setup, and start orchestrating projects and tasks from a modern, scalable platform."
      highlights={registerHighlights}
    >
      <Card className="animate-in fade-in slide-in-from-right-4 w-full max-w-md border-border/70 bg-card/85 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create your account and start your first workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="register-first-name">First Name</Label>
                <Input
                  id="register-first-name"
                  name="firstName"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-last-name">
                  Last Name{" "}
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="register-last-name"
                  name="lastName"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email-id">Email ID</Label>
              <Input
                id="register-email-id"
                name="emailId"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Create password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border-input bg-background accent-primary"
                required
              />
              I agree to the terms and privacy policy.
            </label>

            <Button type="submit" size="lg" className="w-full">
              Create Workspace
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
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

export default Register;
