import {
  IconCalendarClock,
  IconClipboardText,
  IconFileDescription,
  IconUsers,
} from "@tabler/icons-react";

import UserAvatar from "@/components/common/UserAvatar";
import { StatusBadge } from "@/components/common/StatusSelectField";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ProjectStatsCards from "./ProjectStatsCards";
import { formatDate } from "./projectDetail.utils";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseDueDate = (dateValue) => {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const daysRemaining = (dateValue) => {
  const parsed = parseDueDate(dateValue);
  if (!parsed) return null;
  return Math.ceil((parsed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

// ─── Component ────────────────────────────────────────────────────────────────

const ProjectOverviewTab = ({ project, stats }) => {
  const members = project?.members ?? [];
  const remaining = daysRemaining(project?.dueDate);
  const isOverdue =
    project?.status !== "COMPLETED" && remaining !== null && remaining < 0;
  const remainingTasks = Math.max((stats?.total ?? 0) - (stats?.completed ?? 0), 0);

  const progressBadgeClass = cn(
    "px-2 py-0 text-xs font-semibold",
    stats.progress >= 100
      ? "border-success/25 bg-success/10 text-success"
      : stats.progress >= 50
        ? "border-info/25 bg-info/10 text-info"
        : "border-muted-foreground/20 bg-muted/30 text-muted-foreground"
  );

  const dueBadgeClass = cn(
    "px-1.5 py-0 text-[10px] font-medium",
    isOverdue
      ? "border-destructive/25 bg-destructive/10 text-destructive"
      : "border-border/40 bg-muted/30 text-muted-foreground"
  );

  const progressItems = [
    { label: "Total", value: stats.total, tone: "text-foreground" },
    { label: "Completed", value: stats.completed, tone: "text-success" },
    { label: "In Progress", value: stats.inProgress, tone: "text-info" },
    { label: "Todo", value: stats.todo, tone: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      <ProjectStatsCards stats={stats} />

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <Card className="border-border/40 bg-card/70 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconClipboardText className="size-4.5 text-primary" />
                    Progress
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stats.completed} of {stats.total} tasks completed
                  </p>
                </div>
                <Badge variant="outline" className={progressBadgeClass}>
                  {stats.progress}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Progress
                  value={stats.progress}
                  className="h-2.5 [&>div]:bg-linear-to-r [&>div]:from-primary [&>div]:to-info"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{stats.completed} done</span>
                  <span>{remainingTasks} remaining</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {progressItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/40 bg-muted/10 px-3 py-3"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.11em] text-muted-foreground uppercase">
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-2xl font-bold tracking-tight tabular-nums",
                        item.tone
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconFileDescription className="size-4.5 text-muted-foreground" />
                Description
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Project summary and scope
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project?.description || "No description provided for this project."}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full border-border/40 bg-card/70 shadow-sm xl:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Details</CardTitle>
            <p className="text-xs text-muted-foreground">
              Timeline and team at a glance
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/40 bg-muted/12 p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-2">
                  <StatusBadge status={project?.status} size="sm" />
                </div>
              </div>

              <div
                className={cn(
                  "rounded-xl border p-3",
                  isOverdue
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border/40 bg-muted/12"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatDate(project?.dueDate)}
                    </p>
                  </div>
                  <Badge variant="outline" className={dueBadgeClass}>
                    <IconCalendarClock className="mr-1 size-3" />
                    {isOverdue
                      ? "Overdue"
                      : remaining === null
                        ? "No date"
                        : remaining === 0
                          ? "Today"
                          : `${remaining}d left`}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/10 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <IconUsers className="size-3.5" />
                  Members
                </p>
                <Badge variant="outline" className="text-[10px]">
                  {members.length}
                </Badge>
              </div>

              {members.length > 0 ? (
                <div className="space-y-2">
                  {members.slice(0, 4).map((member) => (
                    <div key={member._id} className="flex items-center gap-2.5">
                      <UserAvatar
                        size="sm"
                        firstName={member.firstName}
                        lastName={member.lastName}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {member.emailId}
                        </p>
                      </div>
                    </div>
                  ))}
                  {members.length > 4 ? (
                    <p className="pt-1 text-[11px] text-muted-foreground">
                      +{members.length - 4} more in Members tab
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No members assigned yet.</p>
              )}
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/8 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(project.createdAt)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">{formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ProjectOverviewTab;
