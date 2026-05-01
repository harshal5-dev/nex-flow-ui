import { useState } from "react";

import {
  IconArrowRight,
  IconBuildingSkyscraper,
  IconCalendar,
  IconDeviceLaptop,
  IconKey,
  IconMail,
  IconShieldCheck,
  IconUserCircle,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import StatusCallout from "@/components/ui/status-callout";

const accountInfo = [
  {
    label: "Workspace",
    value: "Next Flow Platform",
    Icon: IconBuildingSkyscraper,
    color: "text-violet-500",
    bg: "border-violet-500/20 bg-violet-500/8",
  },
  {
    label: "Role",
    value: "Admin",
    Icon: IconShieldCheck,
    color: "text-blue-500",
    bg: "border-blue-500/20 bg-blue-500/8",
  },
  {
    label: "Member Since",
    value: "Jan 2025",
    Icon: IconCalendar,
    color: "text-emerald-500",
    bg: "border-emerald-500/20 bg-emerald-500/8",
  },
  {
    label: "Last Login",
    value: "2 min ago",
    Icon: IconDeviceLaptop,
    color: "text-amber-500",
    bg: "border-amber-500/20 bg-amber-500/8",
  },
];

const accountActions = [
  {
    title: "Reset Password",
    description: "Change your current password for security.",
    Icon: IconKey,
    color: "text-amber-500",
    bg: "border-amber-500/20 bg-amber-500/8",
  },
  {
    title: "Manage Sessions",
    description: "View and revoke active login sessions.",
    Icon: IconDeviceLaptop,
    color: "text-blue-500",
    bg: "border-blue-500/20 bg-blue-500/8",
  },
];

function Profile() {
  const [profileForm, setProfileForm] = useState({
    firstName: "Shraddha",
    lastName: "Harshal",
    emailId: "shraddha@nexflow.com",
  });
  const [status, setStatus] = useState(null);

  const handleFieldChange = (field) => (event) => {
    setProfileForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setStatus({
      variant: "success",
      title: "Saved",
      message: "Profile updated successfully.",
    });
  };

  const initials =
    (profileForm.firstName?.[0] || "") + (profileForm.lastName?.[0] || "");

  return (
    <div className="grid gap-4">
      {/* ── Profile Header Card ─────────────────────────────────────── */}
      <Card className="relative animate-in overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur duration-500 fade-in slide-in-from-bottom-2">
        {/* Cover band with decorative blobs */}
        <div className="relative h-32 overflow-hidden bg-linear-to-br from-primary/20 via-primary/10 to-violet-500/15 sm:h-36">
          <span className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/20 blur-2xl" />
          <span className="absolute -bottom-10 left-8 size-24 rounded-full bg-violet-500/15 blur-2xl" />
        </div>

        <CardContent className="relative px-5 pt-0 pb-5">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <span className="inline-flex size-20 items-center justify-center rounded-2xl border-4 border-card bg-linear-to-br from-primary/25 to-primary/10 text-2xl font-bold text-primary shadow-xl sm:size-24">
                {initials.toUpperCase()}
              </span>
              <span className="absolute -right-1 -bottom-1 size-4 rounded-full border-2 border-card bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Name + role + email */}
            <div className="mb-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {profileForm.firstName} {profileForm.lastName}
                </h2>
                <Badge
                  variant="outline"
                  className="gap-1 border-primary/25 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary"
                >
                  <IconShieldCheck className="size-3" />
                  Admin
                </Badge>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconMail className="size-3 shrink-0" />
                {profileForm.emailId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Account Info Grid ───────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {accountInfo.map((item, index) => (
          <Card
            key={item.label}
            className="group animate-in rounded-xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:shadow-md"
            style={{ animationDelay: `${60 + index * 70}ms` }}
          >
            <CardContent className="flex items-center gap-3 p-3.5">
              <span
                className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg border ${item.bg} transition-transform duration-300 group-hover:scale-105`}
              >
                <item.Icon className={`size-4 ${item.color}`} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold tracking-tight">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Basic Info Form + Account Actions ──────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Basic Information */}
        <Card className="animate-in rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur delay-100 duration-500 fade-in slide-in-from-bottom-2">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/8">
                <IconUserCircle className="size-4 text-primary" />
              </span>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Basic Information
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Keep your profile details up to date.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {status ? (
              <StatusCallout
                variant={status.variant}
                title={status.title}
                message={status.message}
                className="mb-4"
                onDismiss={() => setStatus(null)}
              />
            ) : null}

            <form className="grid gap-4" onSubmit={handleSave}>
              {/* Name row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={handleFieldChange("firstName")}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={handleFieldChange("lastName")}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Email row */}
              <div className="space-y-2">
                <Label htmlFor="emailId" className="text-xs font-medium">
                  Email Address
                </Label>
                <Input
                  id="emailId"
                  type="email"
                  value={profileForm.emailId}
                  onChange={handleFieldChange("emailId")}
                  className="rounded-lg"
                />
              </div>

              <Separator className="bg-border/40" />

              <div className="flex items-center">
                <Button type="submit" className="gap-1.5 rounded-lg">
                  Save Changes
                  <IconArrowRight className="size-3.5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="animate-in rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur delay-150 duration-500 fade-in slide-in-from-bottom-2">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/8">
                <IconShieldCheck className="size-4 text-primary" />
              </span>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Account Actions
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Security and session management.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-2.5">
              {accountActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  className="group flex items-center gap-3.5 rounded-xl border border-border/50 bg-background/50 p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                >
                  <span
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border ${action.bg} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <action.Icon className={`size-5 ${action.color}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{action.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <IconArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
