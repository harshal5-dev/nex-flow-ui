import {
  IconCalendar,
  IconCalendarClock,
  IconChecklist,
  IconClockHour4,
  IconFileDescription,
  IconFolders,
  IconMail,
  IconUsers,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/common/StatusSelectField";
import UserAvatar from "@/components/common/UserAvatar";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseDueDate = (dateValue) => {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatFullDate = (dateValue) => {
  const parsed = parseDueDate(dateValue);
  if (!parsed) return null;
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isOverdue = (project) => {
  if (!project?.dueDate || project?.status === "COMPLETED") return false;
  const deadline = parseDueDate(project.dueDate);
  if (!deadline) return false;
  return deadline.getTime() < Date.now();
};

const daysRemaining = (dateValue) => {
  const parsed = parseDueDate(dateValue);
  if (!parsed) return null;
  const diff = Math.ceil(
    (parsed.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

// ─── Task status config ───────────────────────────────────────────────────────

const TASK_STATUS_CONFIG = {
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-info",
    badge: "border-info/25 bg-info/10 text-info",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-success",
    badge: "border-success/25 bg-success/10 text-success",
  },
  TODO: {
    label: "Todo",
    dot: "bg-muted-foreground",
    badge: "border-muted-foreground/25 bg-muted/35 text-muted-foreground",
  },
  REVIEW: {
    label: "Review",
    dot: "bg-pending",
    badge: "border-pending/25 bg-pending/10 text-pending",
  },
  ON_HOLD: {
    label: "On Hold",
    dot: "bg-warning",
    badge: "border-warning/25 bg-warning/10 text-warning",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-destructive",
    badge: "border-destructive/25 bg-destructive/10 text-destructive",
  },
};

const getTaskStatus = (status) =>
  TASK_STATUS_CONFIG[status] ?? TASK_STATUS_CONFIG.TODO;

// ─── Component ────────────────────────────────────────────────────────────────

const ViewProject = ({ project, onClose, onEdit }) => {
  if (!project) return null;

  const dueDateParsed = parseDueDate(project.dueDate);
  const overdue = isOverdue(project);
  const remaining = daysRemaining(project.dueDate);
  const assignees = project.assignees ?? [];
  const tasks = project.tasks ?? [];

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header: name + status + description ──────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {project.name}
          </h2>
          {project.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/50 italic">
              No description provided.
            </p>
          )}
        </div>
        <StatusBadge status={project.status} size="default" />
      </div>

      {/* ── Due date + stats inline bar ──────────────────────────────────── */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border px-4 py-2.5",
          overdue
            ? "border-destructive/30 bg-destructive/5"
            : "border-border/50 bg-muted/15"
        )}
      >
        {/* Due date */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              overdue
                ? "text-destructive"
                : dueDateParsed
                  ? "text-primary"
                  : "text-muted-foreground"
            )}
          >
            {overdue ? (
              <IconCalendarClock className="size-4" />
            ) : (
              <IconCalendar className="size-4" />
            )}
          </span>
          <span className="text-sm font-medium">
            {dueDateParsed ? formatFullDate(project.dueDate) : "No due date"}
          </span>
          {overdue ? (
            <Badge
              variant="outline"
              className="border-destructive/30 bg-destructive/10 px-1.5 py-0 text-[10px] font-semibold text-destructive"
            >
              Overdue
            </Badge>
          ) : remaining !== null && remaining > 0 ? (
            <span className="text-xs text-muted-foreground">
              · {remaining}d left
            </span>
          ) : remaining === 0 ? (
            <span className="text-xs text-muted-foreground">· Due today</span>
          ) : null}
        </div>

        <Separator
          orientation="vertical"
          className="hidden h-5 bg-border/40 sm:block"
        />

        {/* Tasks count */}
        <div className="flex items-center gap-2">
          <IconChecklist className="size-4 text-info" />
          <span className="text-sm font-medium">
            {project.taskCount ?? tasks.length} tasks
          </span>
        </div>

        <Separator
          orientation="vertical"
          className="hidden h-5 bg-border/40 sm:block"
        />

        {/* Assignees count */}
        <div className="flex items-center gap-2">
          <IconUsers className="size-4 text-primary" />
          <span className="text-sm font-medium">
            {project.assigneeCount ?? assignees.length} members
          </span>
        </div>
      </div>

      {/* ── Two-column: Tasks & Assignees ────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* ── Tasks ──────────────────────────────────────────────────────── */}
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <IconChecklist className="size-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold tracking-tight">
              Tasks
              <span className="ml-1.5 font-normal text-muted-foreground">
                ({tasks.length})
              </span>
            </h3>
          </div>

          {tasks.length > 0 ? (
            <div className="divide-y divide-border/30 overflow-hidden rounded-lg border border-border/50">
              {tasks.map((task, index) => {
                const taskStatus = getTaskStatus(task.status);
                return (
                  <div
                    key={task._id ?? index}
                    className="flex items-center justify-between gap-2 bg-card/60 px-3.5 py-2.5 transition-colors hover:bg-muted/20"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/20 text-[10px] font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <p className="truncate text-sm font-medium">
                        {task.name}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 px-2 py-0 text-[10px] font-semibold",
                        taskStatus.badge
                      )}
                    >
                      <span
                        className={cn(
                          "mr-1 inline-block size-1.5 rounded-full",
                          taskStatus.dot
                        )}
                      />
                      {taskStatus.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="flex flex-col items-center gap-1.5 rounded-lg border-dashed border-border/40 bg-muted/10 px-3 py-8 text-center shadow-none">
              <IconFileDescription className="size-5 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">No tasks yet</p>
            </Card>
          )}
        </div>

        {/* ── Assignees ──────────────────────────────────────────────────── */}
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <IconUsers className="size-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold tracking-tight">
              Assignees
              <span className="ml-1.5 font-normal text-muted-foreground">
                ({assignees.length})
              </span>
            </h3>
          </div>

          {assignees.length > 0 ? (
            <div className="divide-y divide-border/30 overflow-hidden rounded-lg border border-border/50">
              {assignees.map((assignee) => (
                <div
                  key={assignee._id}
                  className="flex items-center gap-3 bg-card/60 px-3.5 py-2.5 transition-colors hover:bg-muted/20"
                >
                  <UserAvatar
                    size="sm"
                    firstName={assignee.firstName}
                    lastName={assignee.lastName}
                    className="ring-2 ring-border/30"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {assignee.firstName} {assignee.lastName}
                    </p>
                    <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                      <IconMail className="size-3 shrink-0" />
                      {assignee.emailId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center gap-1.5 rounded-lg border-dashed border-border/40 bg-muted/10 px-3 py-8 text-center shadow-none">
              <IconUsers className="size-5 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">No assignees yet</p>
            </Card>
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-border/40 pt-4">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <IconClockHour4 className="size-3.5" />
          <span>
            Created:{" "}
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => onEdit(project)}
            >
              <IconFolders className="size-4" />
              Edit Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
