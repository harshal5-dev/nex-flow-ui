import {
  IconArrowRight,
  IconBuildingSkyscraper,
  IconChecklist,
  IconClockHour4,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const quickStats = [
  {
    label: "Active Tenants",
    value: "18",
    note: "+3 this month",
    Icon: IconBuildingSkyscraper,
  },
  {
    label: "Live Projects",
    value: "42",
    note: "11 in current sprint",
    Icon: IconChecklist,
  },
  {
    label: "Open Tasks",
    value: "126",
    note: "24 high-priority",
    Icon: IconClockHour4,
  },
];

const todayPriorities = [
  "Finalize tenant onboarding checklist",
  "Review sprint blockers for mobile squad",
  "Approve role-permission matrix updates",
];

const recentUpdates = [
  "Acme Retail moved migration rollout to In Progress.",
  "12 tasks were completed in the last 24 hours.",
  "New team member invited to Bright Labs workspace.",
];

function Dashboard() {
  return (
    <main className="grid gap-4">
      <section className="grid gap-3 sm:grid-cols-3">
        {quickStats.map((item, index) => (
          <Card
            key={item.label}
            className="animate-in rounded-md border-border/70 bg-card p-4 shadow-none duration-500 fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${60 + index * 90}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
              </div>
              <span className="rounded-md border border-primary/25 bg-primary/10 p-2">
                <item.Icon className="size-4 text-primary" />
              </span>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-md border-border/70 bg-card p-4 shadow-none md:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">Today&apos;s Focus</p>
              <p className="text-xs text-muted-foreground">
                High-impact items for current delivery cycle
              </p>
            </div>
            <Button size="sm" variant="outline">
              Open Board
              <IconArrowRight className="ml-1 size-4" />
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            {todayPriorities.map((item) => (
              <Card
                key={item}
                className="rounded-md border-border/70 bg-background px-3 py-2.5 shadow-none"
              >
                <p className="text-sm text-foreground/90">{item}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="rounded-md border-border/70 bg-card p-4 shadow-none md:p-5">
          <p className="text-sm font-semibold">Recent Activity</p>
          <div className="mt-3 space-y-2">
            {recentUpdates.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 rounded-md border border-border/70 bg-background px-3 py-2"
              >
                <span className="mt-1.5 size-1.5 rounded-full bg-primary" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}

export default Dashboard;
