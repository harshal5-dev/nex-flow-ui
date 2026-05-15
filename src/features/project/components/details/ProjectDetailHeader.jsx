import {
  IconArrowLeft,
  IconCalendar,
  IconEdit,
  IconFolders,
  IconPlus,
  IconUsers,
} from "@tabler/icons-react";

import UserAvatar from "@/components/common/UserAvatar";
import { StatusBadge } from "@/components/common/StatusSelectField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "./projectDetail.utils";

const ProjectDetailHeader = ({
  project,
  canEditProject,
  canCreateTask,
  onBack,
  onEditProject,
  onAddTask,
}) => {
  const members = project?.members ?? [];
  const visibleMembers = members.slice(0, 3);
  const extraCount = Math.max(0, members.length - 3);

  return (
    <Card className="border-border/40 bg-card p-0 shadow-md">
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        {/* Top row: breadcrumb + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2 h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={onBack}
            >
              <IconArrowLeft className="size-3.5" />
              Back
            </Button>
            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
              <IconFolders className="size-4 dark:text-white" />
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">
                Projects
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-semibold text-foreground">
                {project.name ?? "Project"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEditProject && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={onEditProject}
              >
                <IconEdit className="size-3.5" />
                Edit
              </Button>
            )}
            {canCreateTask && (
              <Button
                type="button"
                size="sm"
                className="gap-1.5 shadow-sm"
                onClick={onAddTask}
              >
                <IconPlus className="size-3.5" />
                Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Middle: name + status */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {project.name}
            </h1>
            {project.description ? (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            ) : null}
          </div>
          <StatusBadge status={project.status} size="default" />
        </div>

        {/* Bottom: metadata row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Due date */}
          <div className="flex items-center gap-2">
            <IconCalendar className="size-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Due </span>
              <span className="font-medium">{formatDate(project.dueDate)}</span>
            </span>
          </div>

          <Separator orientation="vertical" className="h-4 bg-border/50" />

          {/* Members */}
          <div className="flex items-center gap-2">
            <IconUsers className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {project.assigneeCount} member
              {project.assigneeCount !== 1 ? "s" : ""}
            </span>
            <div className="ml-1 flex -space-x-1.5">
              {visibleMembers.map((member) => (
                <UserAvatar
                  key={member._id}
                  size="xs"
                  firstName={member.firstName}
                  lastName={member.lastName}
                  className="ring-2 ring-background"
                />
              ))}
              {extraCount > 0 && (
                <span className="inline-flex size-6 items-center justify-center rounded-full border border-border/60 bg-muted text-[9px] font-semibold text-muted-foreground ring-2 ring-background">
                  +{extraCount}
                </span>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="h-4 bg-border/50" />

          {/* Tasks */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1 border-border/40 bg-muted/30 px-2 py-0 text-[11px] font-medium"
            >
              {project.taskCount ?? 0} tasks
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectDetailHeader;
