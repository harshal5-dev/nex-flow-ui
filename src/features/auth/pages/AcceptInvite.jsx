import { Link, useSearchParams } from "react-router-dom";
import {
  IconMailOpened,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";

import AuthPageShell from "@/components/common/AuthPageShell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AcceptInviteForm from "../components/AcceptInviteForm";

const inviteHighlights = [
  {
    title: "Secure Access Setup",
    description:
      "Set your password through a protected invitation token shared by your admin.",
  },
  {
    title: "Role-based Workspace Entry",
    description:
      "You will enter the workspace with the permissions assigned to your invitation.",
  },
  {
    title: "Fast Team Onboarding",
    description:
      "Complete setup in under a minute and start collaborating with your team.",
  },
];

function maskToken(token = "") {
  if (token.length <= 16) {
    return token;
  }

  return `${token.slice(0, 8)}...${token.slice(-8)}`;
}

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";
  const hasToken = Boolean(token);

  return (
    <AuthPageShell
      badge="Invitation Access"
      title="You have been invited to join a Nex Flow workspace."
      description="Create your password to activate your invited account and start collaborating with your team."
      highlights={inviteHighlights}
    >
      <Card className="relative w-full max-w-lg animate-in overflow-hidden border-border/50 bg-card/92 p-0 shadow-xl backdrop-blur-sm duration-500 fade-in slide-in-from-bottom-3">
        <span className="pointer-events-none absolute -top-20 -right-8 size-48 rounded-full bg-primary/14 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-info/12 blur-3xl" />

        <div className="relative h-1 rounded-t-2xl bg-linear-to-r from-info/45 via-primary to-success/45" />

        <CardHeader className="relative px-6 pt-6 pb-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <Badge
              variant={hasToken ? "secondary" : "destructive"}
              className={hasToken ? "bg-success/12 text-success" : ""}
            >
              {hasToken ? "Secure Invite Link" : "Token Missing"}
            </Badge>
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
              {hasToken ? (
                <IconShieldCheck className="size-4" />
              ) : (
                <IconMailOpened className="size-4" />
              )}
            </span>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Accept invitation
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Choose a strong password for your invited account and continue to
            your workspace.
          </CardDescription>

          {hasToken && (
            <div className="mt-4 rounded-xl border border-border/60 bg-muted/35 px-3 py-2.5">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Invitation token preview
              </p>
              <p className="mt-1 truncate font-mono text-xs text-foreground/90">
                {maskToken(token)}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="relative px-6 pb-4">
          <AcceptInviteForm token={token} />
        </CardContent>

        <CardFooter className="justify-center px-6 pb-6">
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            Already have access?
            <Link
              to="/signin"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
            <IconSparkles className="size-3.5 text-primary/70" />
          </p>
        </CardFooter>
      </Card>
    </AuthPageShell>
  );
};

export default AcceptInvite;
