import { useMemo, useState } from "react";
import {
  IconArrowRight,
  IconChecklist,
  IconEye,
  IconMail,
  IconSearch,
  IconUserMinus,
  IconUsers,
} from "@tabler/icons-react";

import EmptyState from "@/components/common/EmptyState";
import PaginationFooter from "@/components/common/PaginationFooter";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { clampPage } from "@/lib/utils";

const MEMBERS_PER_PAGE = 3;

const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.emailId ||
  "User";

const getWorkload = (count) => {
  if (count >= 6) {
    return {
      label: "High",
      className: "border-destructive/25 bg-destructive/8 text-destructive",
    };
  }
  if (count >= 3) {
    return {
      label: "Balanced",
      className: "border-info/25 bg-info/8 text-info",
    };
  }
  if (count >= 1) {
    return {
      label: "Light",
      className: "border-success/25 bg-success/8 text-success",
    };
  }
  return {
    label: "Idle",
    className: "border-border/50 bg-muted/20 text-muted-foreground",
  };
};

const ProjectMembersTab = ({
  members = [],
  tasks = [],
  onViewMemberTasks,
  onRemoveMember,
  canManageMembers = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const assignedCounts = tasks.reduce((accumulator, task) => {
    const assignee =
      task.assignedTo ||
      (Array.isArray(task.assignees) ? task.assignees[0] : task.assignees);

    const id =
      typeof assignee === "string" ? assignee : assignee?._id || assignee?.id;
    if (!id) return accumulator;

    accumulator[id] = (accumulator[id] ?? 0) + 1;
    return accumulator;
  }, {});

  const totalAssignedTasks = Object.values(assignedCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
      const text = [
        member?.firstName,
        member?.lastName,
        member?.emailId,
        member?.role?.name || member?.roleName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [members, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE)
  );
  const activePage = clampPage(currentPage, totalPages);

  const paginatedMembers = useMemo(() => {
    const start = (activePage - 1) * MEMBERS_PER_PAGE;
    return filteredMembers.slice(start, start + MEMBERS_PER_PAGE);
  }, [filteredMembers, activePage]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(clampPage(nextPage, totalPages));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  if (members.length === 0) {
    return (
      <EmptyState
        title="No members yet"
        description="Assign team members to this project to get started."
        icon={IconUsers}
      />
    );
  }

  return (
    <Card className="overflow-hidden border-border/50 bg-card/70 shadow-sm">
      <CardHeader className="space-y-3 border-b border-border/40 bg-muted/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg">Project Members</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Team members contributing to this project.
            </CardDescription>
          </div>
          <div className="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:min-w-[320px] sm:items-end">
            <div className="flex items-center justify-start gap-2 sm:justify-end">
              <Badge
                variant="outline"
                className="border-border/50 bg-background px-2 py-0 text-[10px] font-medium"
              >
                {members.length} member{members.length !== 1 ? "s" : ""}
              </Badge>
              <Badge
                variant="outline"
                className="border-info/20 bg-info/8 px-2 py-0 text-[10px] font-medium text-info"
              >
                {totalAssignedTasks} assigned tasks
              </Badge>
            </div>
            <div className="relative w-full sm:w-[320px]">
              <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search member..."
                className="h-9 border-border/50 bg-background pl-8 text-xs shadow-none"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {filteredMembers.length === 0 ? (
          <EmptyState
            compact
            title="No members found"
            description="Try searching with a different name or email."
            icon={IconUsers}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedMembers.map((member) => {
              const memberId = member._id;
              const taskCount = assignedCounts[memberId] || 0;
              const workload = getWorkload(taskCount);

              return (
                <Card
                  key={memberId}
                  className="group overflow-hidden border-border/50 bg-background/80 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm"
                >
                  <CardContent className="flex h-full flex-col gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        size="md"
                        firstName={member.firstName}
                        lastName={member.lastName}
                        className="ring-2 ring-border/20 transition-shadow group-hover:ring-primary/30"
                      />
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold">
                          {getUserDisplayName(member)}
                        </h4>
                        <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                          <IconMail className="size-3 shrink-0" />
                          {member.emailId || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-border/50 bg-muted/30 px-2 py-0 text-[10px] font-medium"
                      >
                        {member.role?.name || member.roleName || "Member"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "px-2 py-0 text-[10px] font-medium",
                          workload.className
                        )}
                      >
                        {workload.label} workload
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-border/40 bg-muted/15 p-2.5">
                        <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                          Tasks
                        </p>
                        <p className="mt-1 text-xl font-bold tracking-tight tabular-nums">
                          {taskCount}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/40 bg-muted/15 p-2.5">
                        <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                          Focus
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold">
                          <IconChecklist className="size-3.5 text-muted-foreground" />
                          Tasks
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 flex-1 gap-1.5 rounded-md border border-primary/20 bg-primary/8 text-xs font-medium text-primary shadow-sm hover:bg-primary/14 hover:text-primary"
                        onClick={() => onViewMemberTasks?.(member)}
                      >
                        <IconEye className="size-3.5" />
                        View Tasks
                        <IconArrowRight className="ml-0.5 size-3.5" />
                      </Button>
                      {canManageMembers && onRemoveMember ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 rounded-md px-2.5 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => onRemoveMember?.(member)}
                        >
                          <IconUserMinus className="size-3.5" />
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
      <PaginationFooter
        currentPage={activePage}
        totalPages={totalPages}
        totalItems={filteredMembers.length}
        itemsPerPage={MEMBERS_PER_PAGE}
        onPageChange={handlePageChange}
        itemLabel="members"
      />
    </Card>
  );
};

export default ProjectMembersTab;
