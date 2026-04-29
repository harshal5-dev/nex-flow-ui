import { useState } from "react";
import {
  IconArrowRight,
  IconDeviceLaptop,
  IconKey,
  IconUserCircle,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusCallout from "@/components/ui/status-callout";

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

  return (
    <main className="grid gap-4">
      <Card className="animate-in rounded-md border-border/70 bg-card p-4 shadow-none duration-500 fade-in slide-in-from-bottom-2 md:p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
            <IconUserCircle className="size-7" />
          </span>
          <div>
            <p className="text-base font-semibold tracking-tight">
              {profileForm.firstName} {profileForm.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{profileForm.emailId}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-md border-border/70 bg-card p-4 shadow-none md:p-5">
          <p className="text-sm font-semibold">Basic Information</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Keep your profile details up to date.
          </p>

          {status ? (
            <StatusCallout
              variant={status.variant}
              title={status.title}
              message={status.message}
              className="mt-4"
              onDismiss={() => setStatus(null)}
            />
          ) : null}

          <form className="mt-4 grid gap-3" onSubmit={handleSave}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileForm.firstName}
                  onChange={handleFieldChange("firstName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileForm.lastName}
                  onChange={handleFieldChange("lastName")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emailId">Email ID</Label>
              <Input
                id="emailId"
                type="email"
                value={profileForm.emailId}
                onChange={handleFieldChange("emailId")}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit">
                Save Changes
                <IconArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-md border-border/70 bg-card p-4 shadow-none md:p-5">
          <p className="text-sm font-semibold">Account Actions</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Quick security settings.
          </p>

          <div className="mt-4 grid gap-2">
            <Button type="button" variant="outline" className="justify-between">
              Reset Password
              <IconKey className="size-4" />
            </Button>
            <Button type="button" variant="outline" className="justify-between">
              Manage Sessions
              <IconDeviceLaptop className="size-4" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Profile;
