import {
  IconArrowRight,
  IconBuildingSkyscraper,
  IconChecklist,
  IconCircleCheck,
  IconClockHour4,
  IconUsers,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const dashboardMetrics = [
  {
    label: "Active Tenants",
    value: "18",
    note: "+3 this month",
    Icon: IconBuildingSkyscraper,
  },
  {
    label: "Running Projects",
    value: "42",
    note: "11 delivery this sprint",
    Icon: IconChecklist,
  },
  {
    label: "Open Tasks",
    value: "126",
    note: "24 high priority",
    Icon: IconClockHour4,
  },
  {
    label: "Team Members",
    value: "64",
    note: "Across 6 organizations",
    Icon: IconUsers,
  },
];

const boardColumns = [
  {
    title: "To Do",
    tasks: [
      "Finalize tenant onboarding checklist",
      "Create sprint goals for mobile squad",
      "Prepare Q2 roadmap review",
    ],
  },
  {
    title: "In Progress",
    tasks: [
      "Role permission matrix refactor",
      "Cross-tenant activity timeline",
      "Billing workspace analytics panel",
    ],
  },
  {
    title: "Done",
    tasks: [
      "Task dependency visualization",
      "Default workspace template setup",
      "Team invite flow polish",
    ],
  },
];

const recentActivity = [
  "Shraddha moved 'Tenant Migration' to In Progress.",
  "API workspace added 14 new task automations.",
  "New organization 'Acme Retail' joined this week.",
];

const tenantProjects = [
  {
    tenant: "Acme Retail",
    project: "Store Expansion Ops",
    status: "On Track",
    completion: 74,
  },
  {
    tenant: "Bright Labs",
    project: "Clinical Dashboard",
    status: "At Risk",
    completion: 51,
  },
  {
    tenant: "Orbital Systems",
    project: "Field Service Suite",
    status: "On Track",
    completion: 82,
  },
];

const statusClasses = {
  "On Track": "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  "At Risk": "border-amber-500/30 bg-amber-500/10 text-amber-600",
};

const progressBarClasses = {
  "On Track": "bg-emerald-500",
  "At Risk": "bg-amber-500",
};

function Dashboard() {
  return (
    <main className="grid gap-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <Card
            key={metric.label}
            className="rounded-lg border-border/70 bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {metric.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {metric.note}
                </p>
              </div>
              <span className="rounded-md border border-primary/25 bg-primary/10 p-2">
                <metric.Icon className="size-4 text-primary" />
              </span>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-lg border-border/70 bg-card p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">Current Sprint</p>
              <p className="text-xs text-muted-foreground">
                Focus tasks for this execution cycle
              </p>
            </div>
            <Button size="sm" variant="outline">
              View Board
              <IconArrowRight className="ml-1 size-4" />
            </Button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {boardColumns.map((column) => (
              <Card
                key={column.title}
                className="rounded-md border-border/70 bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{column.title}</p>
                  <span className="rounded-sm border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                    {column.tasks.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {column.tasks.map((task) => (
                    <div
                      key={task}
                      className="rounded-md border border-border/70 bg-background px-2.5 py-2"
                    >
                      <p className="text-xs leading-relaxed font-medium">
                        {task}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="rounded-lg border-border/70 bg-card p-4 md:p-5">
          <p className="text-sm font-semibold">Recent Activity</p>
          <div className="mt-3 space-y-2">
            {recentActivity.map((item) => (
              <div
                key={item}
                className="rounded-md border border-border/70 bg-muted/20 px-3 py-2"
              >
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <Card className="mt-4 rounded-md border-primary/20 bg-primary/5 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">Milestone Health</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  84% of milestones are on schedule for this cycle.
                </p>
              </div>
              <IconCircleCheck className="size-5 text-primary" />
            </div>
          </Card>
        </Card>
      </section>

      <Card className="rounded-lg border-border/70 bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Projects by Tenant</p>
            <p className="text-xs text-muted-foreground">
              Delivery status and completion snapshot
            </p>
          </div>
          <Button size="sm" variant="outline">
            View Reports
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <div className="hidden grid-cols-[1.2fr_1.6fr_0.8fr_0.6fr] gap-2 px-3 text-[11px] tracking-[0.14em] text-muted-foreground uppercase md:grid">
            <p>Tenant</p>
            <p>Project</p>
            <p>Status</p>
            <p>Progress</p>
          </div>

          {tenantProjects.map((item) => (
            <div
              key={item.tenant + item.project}
              className="grid gap-2 rounded-md border border-border/70 bg-background px-3 py-3 md:grid-cols-[1.2fr_1.6fr_0.8fr_0.6fr] md:items-center"
            >
              <p className="text-sm font-medium">{item.tenant}</p>
              <p className="text-sm text-muted-foreground">{item.project}</p>
              <p>
                <span
                  className={`inline-flex rounded-sm border px-2 py-0.5 text-[11px] font-medium ${statusClasses[item.status]}`}
                >
                  {item.status}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-sm bg-muted">
                  <div
                    className={`h-full rounded-sm ${progressBarClasses[item.status]}`}
                    style={{ width: `${item.completion}%` }}
                  />
                </div>
                <p className="w-10 text-right text-xs font-semibold">
                  {item.completion}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}

export default Dashboard;
