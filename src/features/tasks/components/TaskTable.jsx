import { useMemo, useState } from "react";
import {
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChecklist,
  IconDotsVertical,
  IconEye,
  IconFilter,
  IconFlag,
  IconPencil,
  IconSearch,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";

import EmptyState from "@/components/common/EmptyState";
import PaginationFooter from "@/components/common/PaginationFooter";
import TableHeadLabel from "@/components/common/TableHeadLabel";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  TASK_STATUS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  normalizeTaskStatus,
} from "@/features/tasks/constants/task.constant";
import { clampPage, cn } from "@/lib/utils";

const ASSIGNEE_ALL = "all";
const TASKS_PER_PAGE = 5;

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

const isOverdueTask = (task) => {
  if (!task?.dueDate) return false;

  const status = normalizeTaskStatus(task?.status);
  if (
    status === TASK_STATUS.COMPLETED ||
    status === TASK_STATUS.DONE ||
    status === TASK_STATUS.CANCELLED
  ) {
    return false;
  }

  const parsed = new Date(task.dueDate);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getTime() < Date.now();
};

const AssigneeFilter = ({ members = [], value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedMember = useMemo(
    () => members.find((member) => member?._id === value) || null,
    [members, value]
  );

  const filteredMembers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
      const text = [member?.firstName, member?.lastName, member?.emailId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [members, searchValue]);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 w-full justify-between border-border/60 bg-background/80 font-normal shadow-none",
            !selectedMember && "text-muted-foreground"
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <IconUser className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selectedMember ? getUserDisplayName(selectedMember) : "All Users"}
            </span>
          </span>
          <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-(--anchor-width) min-w-72 p-0"
      >
        <div className="border-b border-border/40 p-2.5">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search user..."
              className="h-8 border-border/50 bg-muted/30 pl-8 text-xs shadow-none"
              onKeyDown={(event) => event.stopPropagation()}
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1.5">
          <button
            type="button"
            onClick={() => {
              onChange(ASSIGNEE_ALL);
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors",
              value === ASSIGNEE_ALL
                ? "border-primary/20 bg-primary/6"
                : "border-transparent hover:bg-muted/60"
            )}
          >
            <span
              className={cn(
                "flex size-4.5 shrink-0 items-center justify-center rounded-md border",
                value === ASSIGNEE_ALL
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/80 bg-background"
              )}
            >
              {value === ASSIGNEE_ALL ? (
                <IconCheck className="size-3" strokeWidth={3} />
              ) : null}
            </span>
            <span className="text-sm font-medium">All Users</span>
          </button>

          {filteredMembers.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No users found.
            </p>
          ) : (
            filteredMembers.map((member) => {
              const memberId = member?._id;
              const isSelected = value === memberId;

              return (
                <button
                  key={memberId}
                  type="button"
                  onClick={() => {
                    onChange(memberId);
                    setOpen(false);
                  }}
                  className={cn(
                    "mt-1 flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors",
                    isSelected
                      ? "border-primary/20 bg-primary/6"
                      : "border-transparent hover:bg-muted/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4.5 shrink-0 items-center justify-center rounded-md border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 bg-background"
                    )}
                  >
                    {isSelected ? (
                      <IconCheck className="size-3" strokeWidth={3} />
                    ) : null}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {getUserDisplayName(member)}
                    </p>
                    {member?.emailId ? (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {member.emailId}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
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
  assigneeFilter = ASSIGNEE_ALL,
  onAssigneeFilterChange = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (assigneeFilter !== ASSIGNEE_ALL) {
        const assigneeId =
          task.assignedTo?._id ||
          task.assignedTo?.id ||
          (Array.isArray(task.assignees)
            ? task.assignees[0]?._id || task.assignees[0]?.id
            : null);

        return assigneeId === assigneeFilter;
      }
      return true;
    });
  }, [tasks, assigneeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
  const activePage = clampPage(currentPage, totalPages);

  const paginatedTasks = useMemo(() => {
    const start = (activePage - 1) * TASKS_PER_PAGE;
    return filteredTasks.slice(start, start + TASKS_PER_PAGE);
  }, [filteredTasks, activePage]);

  const handleAssigneeFilterChange = (nextValue) => {
    onAssigneeFilterChange(nextValue);
    setCurrentPage(1);
  };

  const handlePageChange = (nextPage) => {
    setCurrentPage(clampPage(nextPage, totalPages));
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 shadow-sm">
        <div className="space-y-3.5 border-b border-border/40 bg-muted/10 p-4 sm:p-4.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                Tasks
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage all tasks for this project.
              </p>
            </div>

            <div className="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:min-w-[320px] sm:items-end">
              <div className="flex items-center justify-start gap-2 sm:justify-end">
                <Badge
                  variant="outline"
                  className="border-border/50 bg-background px-2 py-0 text-[10px] font-medium"
                >
                  Total {tasks.length}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/8 px-2 py-0 text-[10px] font-medium text-primary"
                >
                  Visible {filteredTasks.length}
                </Badge>
              </div>

              <div className="w-full sm:w-[320px]">
                <AssigneeFilter
                  members={members}
                  value={assigneeFilter}
                  onChange={handleAssigneeFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="h-9 text-xs">
                  <TableHeadLabel Icon={IconChecklist} label="Task Title" />
                </TableHead>
                <TableHead className="h-9 text-xs">
                  <TableHeadLabel Icon={IconFilter} label="Status" />
                </TableHead>
                <TableHead className="h-9 text-xs">
                  <TableHeadLabel Icon={IconFlag} label="Priority" />
                </TableHead>
                <TableHead className="h-9 text-xs">
                  <TableHeadLabel Icon={IconUser} label="Assigned To" />
                </TableHead>
                <TableHead className="h-9 text-xs">
                  <TableHeadLabel Icon={IconCalendar} label="Due Date" />
                </TableHead>
                <TableHead className="h-9 text-xs">Created</TableHead>
                <TableHead className="w-16 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10">
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
                paginatedTasks.map((task) => (
                  <TableRow
                    key={task._id}
                    className="group border-border/40 transition-colors hover:bg-muted/20"
                  >
                    <TableCell className="py-2 align-top">
                      <button
                        type="button"
                        className="max-w-[340px] text-left"
                        onClick={() => onViewTask(task)}
                      >
                        <p className="font-medium group-hover:text-primary">
                          {task.title}
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {task.description || "No description"}
                        </p>
                      </button>
                    </TableCell>
                    <TableCell className="py-2">
                      <TaskStatusBadge status={task.status} />
                    </TableCell>
                    <TableCell className="py-2">
                      <TaskPriorityBadge priority={task.priority} />
                    </TableCell>
                    <TableCell className="py-2">
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
                            {getUserDisplayName(task.assignedTo)}
                          </span>
                        </div>
                      ) : Array.isArray(task.assignees) &&
                        task.assignees.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            key={task.assignees[0]?._id || task.assignees[0]?.id}
                            size="sm"
                            firstName={task.assignees[0]?.firstName}
                            lastName={task.assignees[0]?.lastName}
                            className="ring-2 ring-background"
                          />
                          <span className="text-xs text-muted-foreground">
                            {getUserDisplayName(task.assignees[0])}
                          </span>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-border/50 bg-muted/20 text-[10px] text-muted-foreground"
                        >
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-medium",
                          isOverdueTask(task)
                            ? "border-destructive/30 bg-destructive/8 text-destructive"
                            : "border-border/50 bg-muted/20 text-muted-foreground"
                        )}
                      >
                        {formatDate(task.dueDate)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {formatDate(task.createdAt)}
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 rounded-md hover:bg-muted/60"
                          >
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
                                (status) =>
                                  status !== normalizeTaskStatus(task.status)
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
        <PaginationFooter
          currentPage={activePage}
          totalPages={totalPages}
          totalItems={filteredTasks.length}
          itemsPerPage={TASKS_PER_PAGE}
          onPageChange={handlePageChange}
          itemLabel="tasks"
        />
      </Card>
    </div>
  );
};

export default TaskTable;
