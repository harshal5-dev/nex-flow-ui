import {
  IconEye,
  IconMail,
  IconUserMinus,
  IconUsers,
} from "@tabler/icons-react";

import EmptyState from "@/components/common/EmptyState";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.emailId ||
  "User";

const ProjectMembersTab = ({
  members = [],
  tasks = [],
  onViewMemberTasks,
  onRemoveMember,
  canManageMembers = false,
}) => {
  const assignedCounts = tasks.reduce((accumulator, task) => {
    (task.assignees ?? []).forEach((assignee) => {
      const id = assignee?._id || assignee?.id;
      if (!id) return;
      accumulator[id] = (accumulator[id] ?? 0) + 1;
    });
    return accumulator;
  }, {});

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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((member) => {
        const memberId = member._id;
        const taskCount = assignedCounts[memberId] || 0;

        return (
          <Card
            key={memberId}
            className="group overflow-hidden border-border/40 bg-card/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
          >
            <CardContent className="flex flex-col gap-4 p-5">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3.5">
                <UserAvatar
                  size="lg"
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
                    {member.emailId || "—"}
                  </p>
                </div>
              </div>

              {/* Role + Task count */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-border/40 bg-muted/30 px-2 py-0 text-[10px] font-medium"
                >
                  {member.role?.name || member.roleName || "Member"}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-info/20 bg-info/8 px-2 py-0 text-[10px] font-medium text-info"
                >
                  {taskCount} task{taskCount !== 1 ? "s" : ""}
                </Badge>
              </div>

              {/* Actions */}
              <div className="mt-auto flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 flex-1 gap-1.5 text-xs"
                  onClick={() => onViewMemberTasks?.(member)}
                >
                  <IconEye className="size-3.5" />
                  View Tasks
                </Button>
                {canManageMembers && onRemoveMember && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveMember?.(member)}
                  >
                    <IconUserMinus className="size-3.5" />
                    Remove
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectMembersTab;
