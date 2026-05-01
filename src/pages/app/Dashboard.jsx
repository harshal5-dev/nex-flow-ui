import { useState } from "react";

import {
  IconArrowRight,
  IconArrowUpRight,
  IconBuildingSkyscraper,
  IconChecklist,
  IconCircleCheck,
  IconClockHour4,
  IconPlus,
  IconSparkles,
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
import { Separator } from "@/components/ui/separator";

const quickStats = [
  {
    label: "Active Tenants",
    value: "18",
    note: "+3 this month",
    trend: "+20%",
    Icon: IconBuildingSkyscraper,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
    gradient: "from-blue-500/8 to-transparent",
  },
  {
    label: "Live Projects",
    value: "42",
    note: "11 in current sprint",
    trend: "+8%",
    Icon: IconChecklist,
    color: "text-violet-500",
    bg: "bg-violet-500/10 border-violet-500/20",
    gradient: "from-violet-500/8 to-transparent",
  },
  {
    label: "Open Tasks",
    value: "126",
    note: "24 high-priority",
    trend: "-5%",
    Icon: IconClockHour4,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
    gradient: "from-amber-500/8 to-transparent",
  },
  {
    label: "Team Members",
    value: "24",
    note: "4 online now",
    trend: "+2",
    Icon: IconUsers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    gradient: "from-emerald-500/8 to-transparent",
  },
];

const todayPriorities = [
  {
    text: "Finalize tenant onboarding checklist",
    priority: "high",
    done: false,
  },
  {
    text: "Review sprint blockers for mobile squad",
    priority: "medium",
    done: false,
  },
  {
    text: "Approve role-permission matrix updates",
    priority: "high",
    done: true,
  },
  {
    text: "Prepare weekly delivery report",
    priority: "low",
    done: false,
  },
];

const recentUpdates = [
  {
    text: "Acme Retail moved migration rollout to In Progress.",
    time: "2 min ago",
    type: "project",
  },
  {
    text: "12 tasks were completed in the last 24 hours.",
    time: "1 hr ago",
    type: "task",
  },
  {
    text: "New team member invited to Bright Labs workspace.",
    time: "3 hrs ago",
    type: "team",
  },
  {
    text: "Sprint planning for Q2 has been finalized.",
    time: "5 hrs ago",
    type: "milestone",
  },
];

const quickActions = [
  {
    label: "New Project",
    Icon: IconBuildingSkyscraper,
    color: "text-violet-500",
    bg: "border-violet-500/20 bg-violet-500/8",
  },
  {
    label: "Add Task",
    Icon: IconPlus,
    color: "text-blue-500",
    bg: "border-blue-500/20 bg-blue-500/8",
  },
  {
    label: "Invite Member",
    Icon: IconUsers,
    color: "text-emerald-500",
    bg: "border-emerald-500/20 bg-emerald-500/8",
  },
  {
    label: "View Reports",
    Icon: IconTrendingUp,
    color: "text-amber-500",
    bg: "border-amber-500/20 bg-amber-500/8",
  },
];

const projectOverview = [
  {
    name: "Acme Retail Portal",
    status: "On Track",
    progress: 72,
    tasks: "18/25",
    statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
  },
  {
    name: "Bright Labs Dashboard",
    status: "At Risk",
    progress: 45,
    tasks: "9/20",
    statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/25",
  },
  {
    name: "CloudSync Migration",
    status: "On Track",
    progress: 89,
    tasks: "31/35",
    statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
  },
];

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-400",
};

const activityTypeColors = {
  project: "bg-violet-500",
  task: "bg-emerald-500",
  team: "bg-blue-500",
  milestone: "bg-amber-500",
};

function Dashboard() {
  const [priorities, setPriorities] = useState(todayPriorities);

  const togglePriority = (index) => {
    setPriorities((current) =>
      current.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  };

  const completedCount = priorities.filter((p) => p.done).length;
  const progressPercent = Math.round(
    (completedCount / priorities.length) * 100
  );

  return (
    <div className="grid gap-5">
      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((item, index) => (
          <Card
            key={item.label}
            className="group relative animate-in overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ animationDelay: `${60 + index * 80}ms` }}
          >
            {/* Top accent shimmer line */}
            <span
              className={`absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-current to-transparent opacity-30 ${item.color}`}
            />

            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                {/* Left: label · value · note */}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {item.label}
                  </p>

                  <div className="mt-2 flex items-baseline gap-2.5">
                    <p className="text-3xl font-bold tracking-tight tabular-nums">
                      {item.value}
                    </p>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                      <IconTrendingUp className="mr-0.5 size-2.5" />
                      {item.trend}
                    </Badge>
                  </div>

                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {item.note}
                  </p>
                </div>

                {/* Right: icon tile */}
                <span
                  className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl border ${item.bg} transition-transform duration-300 group-hover:scale-105`}
                >
                  <item.Icon className={`size-5 ${item.color}`} />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Quick Actions ───────────────────────────────────────────── */}
      <section className="animate-in delay-100 duration-500 fade-in slide-in-from-bottom-2">
        <Card className="rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
          <CardContent className="p-5">
            {/* Header row */}
            <div className="mb-3.5 flex items-center gap-2">
              <IconSparkles className="size-3.5 text-primary" />
              <p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">
                Quick Actions
              </p>
            </div>

            {/* Action button grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="group flex items-center gap-2.5 rounded-xl border border-border/50 bg-background/50 p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                >
                  <span
                    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg border ${action.bg} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <action.Icon className={`size-4 ${action.color}`} />
                  </span>
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Today's Focus + Recent Activity ─────────────────────────── */}
      <section className="grid animate-in gap-4 delay-150 duration-500 fade-in slide-in-from-bottom-2 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Today's Focus */}
        <Card className="rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Today&apos;s Focus
                </CardTitle>
                <CardDescription className="mt-0.5 text-[11px]">
                  High-impact items for the current delivery cycle
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 gap-1.5 rounded-lg text-xs"
              >
                Open Board
                <IconArrowRight className="size-3" />
              </Button>
            </div>

            {/* Progress row */}
            <div className="mt-3.5 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground tabular-nums">
                {completedCount}&thinsp;/&thinsp;{priorities.length} done
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="space-y-1.5">
              {priorities.map((item, index) => (
                <button
                  key={item.text}
                  type="button"
                  onClick={() => togglePriority(index)}
                  className={`group flex w-full items-center gap-3 rounded-xl border border-border/40 bg-background/50 px-3 py-2.5 text-left transition-all duration-200 hover:border-border/70 hover:bg-background/80 ${
                    item.done ? "opacity-60" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <span
                    className={`inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                      item.done
                        ? "border-primary/30 bg-primary/15 text-primary"
                        : "border-border/70 bg-background group-hover:border-primary/30"
                    }`}
                  >
                    {item.done && <IconCircleCheck className="size-3.5" />}
                  </span>

                  {/* Priority dot */}
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${priorityColors[item.priority]}`}
                  />

                  <span
                    className={`flex-1 text-[13px] leading-snug ${
                      item.done
                        ? "text-muted-foreground line-through"
                        : "text-foreground/90"
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Recent Activity
            </CardTitle>
            <CardDescription className="mt-0.5 text-[11px]">
              Latest updates across your workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <div>
              {recentUpdates.map((item, index) => (
                <div key={item.text} className="flex items-start gap-3 py-2.5">
                  {/* Timeline column: dot + connector line */}
                  <div className="flex flex-col items-center self-stretch pt-1">
                    <span
                      className={`size-2 shrink-0 rounded-full shadow-sm ${activityTypeColors[item.type]}`}
                    />
                    {index < recentUpdates.length - 1 && (
                      <span className="mt-1 w-px flex-1 rounded-full bg-border/50" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pb-0.5">
                    <p className="text-[13px] leading-relaxed text-foreground/85">
                      {item.text}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Project Overview ────────────────────────────────────────── */}
      <section className="animate-in delay-200 duration-500 fade-in slide-in-from-bottom-2">
        <Card className="rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Project Overview
                </CardTitle>
                <CardDescription className="mt-0.5 text-[11px]">
                  Active project health and delivery progress
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                View All
                <IconArrowUpRight className="size-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-3">
              {projectOverview.map((project) => (
                <div
                  key={project.name}
                  className="group rounded-xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                >
                  {/* Project name + status */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] leading-snug font-semibold tracking-tight">
                      {project.name}
                    </p>
                    <Badge
                      variant="outline"
                      className={`shrink-0 px-1.5 py-0 text-[10px] font-semibold ${project.statusColor}`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="mt-3.5">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-semibold tabular-nums">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <Separator className="my-3 bg-border/40" />

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Tasks</span>
                    <span className="font-semibold text-foreground/80 tabular-nums">
                      {project.tasks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;
