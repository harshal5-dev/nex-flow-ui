import { useState } from "react";
import {
  IconArrowUpRight,
  IconChecklist,
  IconClockHour4,
  IconCircleCheck,
  IconFolders,
  IconPlus,
  IconTrendingUp,
  IconUsers,
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
import { cn } from "@/lib/utils";

const quickStats = [
  {
    label: "Projects",
    value: "12",
    trend: "+2 this month",
    Icon: IconFolders,
    tone: "text-blue-600 dark:text-blue-400",
    bg: "border-blue-500/25 bg-blue-500/10",
  },
  {
    label: "Tasks",
    value: "37",
    trend: "9 due this week",
    Icon: IconChecklist,
    tone: "text-violet-600 dark:text-violet-400",
    bg: "border-violet-500/25 bg-violet-500/10",
  },
  {
    label: "Team",
    value: "08",
    trend: "6 active today",
    Icon: IconUsers,
    tone: "text-emerald-600 dark:text-emerald-400",
    bg: "border-emerald-500/25 bg-emerald-500/10",
  },
];

const projects = [
  { name: "Portfolio Website", progress: 78, status: "In Progress" },
  { name: "Client Admin Panel", progress: 52, status: "In Progress" },
  { name: "Design System", progress: 93, status: "Review" },
];

const initialFocus = [
  { text: "Finish dashboard responsiveness", done: false },
  { text: "Refine sidebar interactions", done: true },
  { text: "Prepare portfolio case study", done: false },
];

function Dashboard() {
  const [focusItems, setFocusItems] = useState(initialFocus);

  const toggleFocus = (index) => {
    setFocusItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <div className="grid gap-4">
      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-2 border-primary/30 bg-primary/10 text-primary"
            >
              Portfolio Dashboard
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Minimal overview of your current work.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">
              View Tasks
            </Button>
            <Button size="sm" className="rounded-lg">
              <IconPlus className="size-3.5" />
              New Project
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-3">
        {quickStats.map((item) => (
          <Card
            key={item.label}
            className="border-border/60 bg-card/80 shadow-sm backdrop-blur"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.trend}</p>
                </div>

                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-lg border",
                    item.bg
                  )}
                >
                  <item.Icon className={cn("size-4", item.tone)} />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current Projects</CardTitle>
            <CardDescription>Track progress at a glance.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 pt-2">
            {projects.map((project) => (
              <div
                key={project.name}
                className="rounded-xl border border-border/60 bg-background/55 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">{project.name}</p>
                  <Badge variant="outline" className="text-[10px]">
                    {project.status}
                  </Badge>
                </div>

                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-blue-500 to-violet-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  {project.progress}% complete
                  <IconArrowUpRight className="size-3" />
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today Focus</CardTitle>
            <CardDescription>Small list, high impact.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-2.5 pt-2">
            {focusItems.map((item, index) => (
              <button
                key={item.text}
                type="button"
                onClick={() => toggleFocus(index)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  item.done
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-border/60 bg-background/55 hover:bg-muted/60"
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-5 items-center justify-center rounded-md border",
                    item.done
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "border-border/60 bg-background text-muted-foreground"
                  )}
                >
                  {item.done ? (
                    <IconCircleCheck className="size-3.5" />
                  ) : (
                    <IconClockHour4 className="size-3.5" />
                  )}
                </span>

                <span
                  className={cn(
                    "text-sm",
                    item.done ? "text-muted-foreground line-through" : "text-foreground"
                  )}
                >
                  {item.text}
                </span>
              </button>
            ))}

            <p className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <IconTrendingUp className="size-3" />
              Focus score improving
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;
