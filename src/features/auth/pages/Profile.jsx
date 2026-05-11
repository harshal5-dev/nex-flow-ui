import {
  IconBuildingSkyscraper,
  IconCalendar,
  IconMail,
  IconShieldCheck,
  IconUserCircle,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "..";
import {
  getUserFullName,
  getUserInitials,
  getUserOrganization,
  getUserPrimaryRole,
  hasAnyPermission,
} from "@/lib/utils";
import ProfileForm from "../components/ProfileForm";
import OrganizationForm from "../components/OrganizationForm";
import { PERMISSIONS } from "@/constant/global";

const accountInfo = (organizationName, roleName, createdAt) => [
  {
    label: "Organization",
    value: organizationName,
    Icon: IconBuildingSkyscraper,
    color: "text-primary",
    bg: "border-primary/20 bg-primary/8",
  },
  {
    label: "Role",
    value: roleName,
    Icon: IconShieldCheck,
    color: "text-info",
    bg: "border-info/20 bg-info/8",
  },
  {
    label: "Member Since",
    value: createdAt,
    Icon: IconCalendar,
    color: "text-success",
    bg: "border-success/20 bg-success/8",
  },
];

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const profileInitials = getUserInitials(user);
  const profileName = getUserFullName(user);
  const profileRole = getUserPrimaryRole(user);
  const organizationName = getUserOrganization(user);
  const createdAt = new Date(user?.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid gap-6">
      {/* ── Profile Header Card ─────────────────────────────────────── */}
      <Card className="relative animate-in overflow-hidden border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur duration-500 fade-in slide-in-from-bottom-2">
        <div className="relative h-32 overflow-hidden bg-linear-to-br from-primary/20 via-primary/10 to-primary/15 sm:h-36">
          <span className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/20 blur-2xl" />
          <span className="absolute -bottom-10 left-8 size-24 rounded-full bg-primary/15 blur-2xl" />
        </div>

        <CardContent className="relative px-5 pt-0 pb-5">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  className="size-20 rounded-2xl border-4 border-card object-cover shadow-xl sm:size-24"
                />
              ) : (
                <span className="inline-flex size-20 items-center justify-center rounded-2xl border-4 border-card bg-primary text-2xl font-bold text-primary-foreground shadow-xl sm:size-24">
                  {profileInitials}
                </span>
              )}
              <span className="absolute -right-1 -bottom-1 size-4 rounded-full border-2 border-card bg-success shadow-sm" />
            </div>

            {/* Name + role + email */}
            <div className="mb-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {profileName}
                </h2>
                <Badge className="gap-1 bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground hover:bg-primary/90">
                  <IconShieldCheck className="size-3" />
                  {profileRole}
                </Badge>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconMail className="size-3 shrink-0" />
                {user.emailId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Account Info Grid ───────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-3">
        {accountInfo(organizationName, profileRole, createdAt).map(
          (item, index) => (
            <Card
              key={item.label}
              className="group animate-in border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:shadow-md"
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
          )
        )}
      </section>

      {/* ── Forms Area ──────────────────────── */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <IconUserCircle className="size-4" />
            Basic
          </TabsTrigger>
          {hasAnyPermission(user?.permissions, [PERMISSIONS.UPDATE_TENANT]) && (
            <TabsTrigger
              value="organization"
              className="flex items-center gap-2"
            >
              <IconBuildingSkyscraper className="size-4" />
              Organization
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="basic" className="mt-0">
          <Card className="animate-in border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur duration-500 fade-in slide-in-from-bottom-2">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/90">
                  <IconUserCircle className="size-5 text-white" />
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
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        {hasAnyPermission(user?.permissions, [PERMISSIONS.UPDATE_TENANT]) && (
          <TabsContent value="organization" className="mt-0">
            <Card className="animate-in border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur duration-500 fade-in slide-in-from-bottom-2">
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/90">
                    <IconBuildingSkyscraper className="size-5 text-white" />
                  </span>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Organization Settings
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      Update your workspace details.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <OrganizationForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
