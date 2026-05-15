import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/common/UserAvatar";
import TaskPriorityBadge from "@/features/tasks/components/TaskPriorityBadge";
import TaskStatusBadge from "@/features/tasks/components/TaskStatusBadge";
import TaskStatusSelect from "@/features/tasks/components/TaskStatusSelect";

const formatDate = (dateValue, includeTime = false) => {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
};

const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.emailId ||
  "User";

const TaskDetailSheet = ({
  open,
  onOpenChange,
  task,
  projectName,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-0 top-0 h-svh max-w-full translate-x-0 translate-y-0 rounded-none sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{task?.title || "Task Details"}</DialogTitle>
          <DialogDescription>
            View task information and take quick actions.
          </DialogDescription>
        </DialogHeader>

        {task ? (
          <div className="space-y-4">
            <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3">
              <p className="text-xs font-semibold text-muted-foreground">Description</p>
              <p className="text-sm leading-relaxed text-foreground">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
              {task.dueDate ? (
                <Badge variant="outline" className="text-[11px]">
                  Due {formatDate(task.dueDate)}
                </Badge>
              ) : null}
            </div>

            {canUpdate ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Change Status</p>
                <TaskStatusSelect
                  value={task.status}
                  onChange={onStatusChange}
                  className="w-full sm:w-56"
                />
              </div>
            ) : null}

            <Separator />

            <dl className="grid gap-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-3">
                <dt className="text-muted-foreground">Project</dt>
                <dd>{projectName || "-"}</dd>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-3">
                <dt className="text-muted-foreground">Assigned To</dt>
                <dd>
                  {task.assignedTo ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          size="sm"
                          firstName={task.assignedTo?.firstName}
                          lastName={task.assignedTo?.lastName}
                        />
                        <div>
                          <p className="text-sm">{getUserDisplayName(task.assignedTo)}</p>
                          {task.assignedTo?.emailId ? (
                            <p className="text-xs text-muted-foreground">{task.assignedTo.emailId}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : Array.isArray(task.assignees) && task.assignees.length > 0 ? (
                    <div className="space-y-2">
                      {task.assignees.map((assignee) => (
                        <div key={assignee?._id || assignee?.id} className="flex items-center gap-2">
                          <UserAvatar
                            size="sm"
                            firstName={assignee?.firstName}
                            lastName={assignee?.lastName}
                          />
                          <div>
                            <p className="text-sm">{getUserDisplayName(assignee)}</p>
                            {assignee?.emailId ? (
                              <p className="text-xs text-muted-foreground">{assignee.emailId}</p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </dd>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-3">
                <dt className="text-muted-foreground">Created By</dt>
                <dd>{task.createdBy ? getUserDisplayName(task.createdBy) : "-"}</dd>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-3">
                <dt className="text-muted-foreground">Created At</dt>
                <dd>{formatDate(task.createdAt, true)}</dd>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-3">
                <dt className="text-muted-foreground">Updated At</dt>
                <dd>{formatDate(task.updatedAt, true)}</dd>
              </div>
            </dl>

            <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
              {canUpdate ? (
                <Button type="button" variant="outline" onClick={onEdit}>
                  Edit Task
                </Button>
              ) : null}
              {canDelete ? (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete Task
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailSheet;
