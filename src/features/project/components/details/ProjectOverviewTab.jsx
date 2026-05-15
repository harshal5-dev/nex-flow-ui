import {
  IconCalendarClock,
  IconClipboardText,
  IconFileDescription,
} from "@tabler/icons-react";

import UserAvatar from "@/components/common/UserAvatar";
import { StatusBadge } from "@/components/common/StatusSelectField";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <ProjectStatsCards stats={stats} />

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Left: Progress + Description (spans 3 cols) ────────────────── */}
        <div className="space-y-6 lg:col-span-3">
          {/* Progress card */}
          <Card className="overflow-hidden border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconClipboardText className="size-4.5 text-primary" />
                Progress
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "px-2 py-0 text-xs font-semibold",
                  stats.progress >= 100
                    ? "border-success/25 bg-success/10 text-success"
                    : stats.progress >= 50
                      ? "border-info/25 bg-info/10 text-info"
                      : "border-muted-foreground/20 bg-muted/30 text-muted-foreground"
                )}
              >
                {stats.progress}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <Progress
                value={stats.progress}
                className="h-2.5 [&>div]:bg-linear-to-r [&>div]:from-primary [&>div]:to-info"
              />

              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    label: "Total",
                    value: stats.total,
                    color: "text-foreground",
                  },
                  {
                    label: "Todo",
                    value: stats.todo,
                    color: "text-muted-foreground",
                  },
                  {
                    label: "In Progress",
                    value: stats.inProgress,
                    color: "text-info",
                  },
                  {
                    label: "Done",
                    value: stats.completed,
                    color: "text-success",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border/40 bg-muted/15 p-2.5 text-center"
                  >
                    <p className="text-2xl font-bold tracking-tight tabular-nums">
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description card */}
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconFileDescription className="size-4.5 text-muted-foreground" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project?.description ||
                  "No description provided for this project."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Info panel (spans 2 cols) ────────────────────────────── */}
        <div className="lg:col-span-2">
          <Card className="h-full border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/15 p-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={project?.status} size="sm" />
              </div>

              {/* Due date */}
              <div
                className={cn(
                  "rounded-lg border p-3",
                  isOverdue
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border/40 bg-muted/15"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Due Date
                  </span>
                  <div className="flex items-center gap-2">
                    {isOverdue ? (
                      <Badge
                        variant="outline"
                        className="border-destructive/25 bg-destructive/10 px-1.5 py-0 text-[10px] font-semibold text-destructive"
                      >
                        <IconCalendarClock className="mr-1 size-3" />
                        Overdue
                      </Badge>
                    ) : remaining !== null && remaining >= 0 ? (
                      <Badge
                        variant="outline"
                        className="border-border/40 bg-muted/30 px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                      >
                        {remaining === 0 ? "Today" : `${remaining}d left`}
                      </Badge>
                    ) : null}
                    <span className="text-sm font-medium">
                      {formatDate(project?.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="rounded-lg border border-border/40 bg-muted/15 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Members · {members.length}
                  </span>
                </div>
                {members.length > 0 ? (
                  <div className="space-y-2.5">
                    {members.slice(0, 6).map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-2.5"
                      >
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
                    {members.length > 6 && (
                      <p className="text-center text-[11px] text-muted-foreground">
                        +{members.length - 6} more members
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-xs text-muted-foreground">
                    No members assigned
                  </p>
                )}
              </div>

              {/* Timestamps */}
              <div className="space-y-2 rounded-lg border border-border/40 bg-muted/10 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {formatDate(project?.createdAt)}
                  </span>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">
                    {formatDate(project?.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverviewTab;
