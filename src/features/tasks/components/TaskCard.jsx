import {
  IconArrowRight,
  IconCalendar,
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskPriorityBadge from "@/features/tasks/components/TaskPriorityBadge";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  normalizeTaskStatus,
} from "@/features/tasks/constants/task.constant";

const formatDate = (dateValue) => {
  if (!dateValue) return "No due date";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "No due date";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const TaskCard = ({
  task,
  canUpdate,
  canDelete,
  onOpenDetail,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const currentStatus = normalizeTaskStatus(task.status);

  return (
    <Card className="border-border/50 bg-card/70 shadow-sm transition-all hover:border-primary/35">
      <CardContent className="space-y-3 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onOpenDetail(task)}
            className="text-left"
          >
            <h4 className="line-clamp-2 text-sm font-semibold tracking-tight">
              {task.title}
            </h4>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => onOpenDetail(task)}>
                <IconEye className="size-4" />
                View Task
              </DropdownMenuItem>

              {canUpdate ? (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <IconPencil className="size-4" />
                  Edit Task
                </DropdownMenuItem>
              ) : null}

              {canUpdate ? <DropdownMenuSeparator /> : null}

              {canUpdate ? (
                <>
                  <DropdownMenuLabel className="text-[10px] tracking-wide uppercase">
                    Move To
                  </DropdownMenuLabel>
                  {TASK_STATUS_ORDER.filter((status) => status !== currentStatus).map(
                    (status) => (
                      <DropdownMenuItem
                        key={`${task._id}-move-${status}`}
                        onClick={() => onStatusChange(task, status)}
                      >
                        <IconArrowRight className="size-4" />
                        {TASK_STATUS_LABELS[status]}
                      </DropdownMenuItem>
                    )
                  )}
                </>
              ) : null}

              {canDelete ? <DropdownMenuSeparator /> : null}

              {canDelete ? (
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={() => onDelete(task)}
                >
                  <IconTrash className="size-4" />
                  Delete Task
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <IconCalendar className="size-3.5" />
            {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
          {task.assignedTo ? (
            <div className="flex items-center gap-2">
              <UserAvatar
                key={task.assignedTo?._id || task.assignedTo?.id}
                size="sm"
                firstName={task.assignedTo?.firstName}
                lastName={task.assignedTo?.lastName}
                className="ring-2 ring-background"
              />
              <span className="text-xs text-muted-foreground">
                {[
                  task.assignedTo?.firstName,
                  task.assignedTo?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") || "Assigned"}
              </span>
            </div>
          ) : Array.isArray(task.assignees) && task.assignees.length > 0 ? (
            <div className="flex items-center gap-2">
              <UserAvatar
                key={task.assignees[0]?._id || task.assignees[0]?.id}
                size="sm"
                firstName={task.assignees[0]?.firstName}
                lastName={task.assignees[0]?.lastName}
                className="ring-2 ring-background"
              />
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )}

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onOpenDetail(task)}
            className="h-6"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
