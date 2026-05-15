import { useMemo, useState } from "react";
import {
  IconArrowRight,
  IconCalendar,
  IconChecklist,
  IconDotsVertical,
  IconEye,
  IconFilter,
  IconFlag,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";

import EmptyState from "@/components/common/EmptyState";
import TableHeadLabel from "@/components/common/TableHeadLabel";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskPriorityBadge from "@/features/tasks/components/TaskPriorityBadge";
import TaskStatusBadge from "@/features/tasks/components/TaskStatusBadge";
import {
  TASK_PRIORITY,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  normalizeTaskPriority,
  normalizeTaskStatus,
} from "@/features/tasks/constants/task.constant";

const TASK_PRIORITY_ORDER = [
  TASK_PRIORITY.LOW,
  TASK_PRIORITY.MEDIUM,
  TASK_PRIORITY.HIGH,
  TASK_PRIORITY.URGENT,
];

const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.emailId ||
  "User";

const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TaskTable = ({
  tasks = [],
  members = [],
  canCreateTask,
  canUpdateTask,
  canDeleteTask,
  onAddTask,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const status = normalizeTaskStatus(task.status);
      const priority = normalizeTaskPriority(task.priority);

      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (priorityFilter !== "all" && priority !== priorityFilter) return false;

      if (assigneeFilter !== "all") {
        const assigneeIds = (task.assignees ?? [])
          .map((assignee) => assignee?._id || assignee?.id)
          .filter(Boolean);

        if (!assigneeIds.includes(assigneeFilter)) return false;
      }

      if (!q) return true;

      const assigneeText = (task.assignees ?? []).map(getUserDisplayName).join(" ");

      return [task.title, task.description, assigneeText]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Tasks</h3>
          <p className="text-xs text-muted-foreground">
            Manage all tasks for this project.
          </p>
        </div>

        {canCreateTask ? (
          <Button type="button" className="gap-1.5" onClick={onAddTask}>
            <IconPlus className="size-4" />
            Add Task
          </Button>
        ) : null}
      </div>

      <Card className="border-border/50 bg-card/70 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(160px,200px))]">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search task by title"
              className="h-9 pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {TASK_STATUS_ORDER.map((status) => (
                <SelectItem key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {TASK_PRIORITY_ORDER.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {members.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {getUserDisplayName(member)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden border-border/50 bg-card/70">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/25 hover:bg-muted/25">
                <TableHead>
                  <TableHeadLabel Icon={IconChecklist} label="Task Title" />
                </TableHead>
                <TableHead>
                  <TableHeadLabel Icon={IconFilter} label="Status" />
                </TableHead>
                <TableHead>
                  <TableHeadLabel Icon={IconFlag} label="Priority" />
                </TableHead>
                <TableHead>
                  <TableHeadLabel Icon={IconUser} label="Assignees" />
                </TableHead>
                <TableHead>
                  <TableHeadLabel Icon={IconCalendar} label="Due Date" />
                </TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-16 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8">
                    <EmptyState
                      compact
                      title="No tasks yet"
                      description="Add your first task to start planning work for this project."
                      actionLabel={canCreateTask ? "Add Task" : undefined}
                      onAction={canCreateTask ? onAddTask : undefined}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task._id} className="border-border/40 hover:bg-muted/20">
                    <TableCell>
                      <button type="button" className="text-left" onClick={() => onViewTask(task)}>
                        <p className="font-medium">{task.title}</p>
                        <p className="line-clamp-1 max-w-[280px] text-xs text-muted-foreground">
                          {task.description || "No description"}
                        </p>
                      </button>
                    </TableCell>
                    <TableCell>
                      <TaskStatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>
                      <TaskPriorityBadge priority={task.priority} />
                    </TableCell>
                    <TableCell>
                      {Array.isArray(task.assignees) && task.assignees.length > 0 ? (
                        <div className="flex -space-x-2">
                          {task.assignees.slice(0, 3).map((assignee) => (
                            <UserAvatar
                              key={assignee?._id || assignee?.id}
                              size="sm"
                              firstName={assignee?.firstName}
                              lastName={assignee?.lastName}
                              className="ring-2 ring-background"
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(task.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onViewTask(task)}>
                            <IconEye className="size-4" />
                            View Task
                          </DropdownMenuItem>

                          {canUpdateTask ? (
                            <DropdownMenuItem onClick={() => onEditTask(task)}>
                              <IconPencil className="size-4" />
                              Edit Task
                            </DropdownMenuItem>
                          ) : null}

                          {canUpdateTask ? <DropdownMenuSeparator /> : null}

                          {canUpdateTask ? (
                            <>
                              <DropdownMenuLabel className="text-[10px] tracking-wide uppercase">
                                Change Status
                              </DropdownMenuLabel>
                              {TASK_STATUS_ORDER.filter(
                                (status) => status !== normalizeTaskStatus(task.status)
                              ).map((status) => (
                                <DropdownMenuItem
                                  key={`${task._id}-${status}`}
                                  onClick={() => onStatusChange(task, status)}
                                >
                                  <IconArrowRight className="size-4" />
                                  {TASK_STATUS_LABELS[status]}
                                </DropdownMenuItem>
                              ))}
                            </>
                          ) : null}

                          {canDeleteTask ? <DropdownMenuSeparator /> : null}

                          {canDeleteTask ? (
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => onDeleteTask(task)}
                            >
                              <IconTrash className="size-4" />
                              Delete Task
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default TaskTable;
