import { useMemo, useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import {
  IconCalendar,
  IconFileDescriptionFilled,
  IconFolders,
  IconLoader,
} from "@tabler/icons-react";
import { useGetProjectsQuery } from "../api/projectApi";
import { clampPage, hasAnyPermission } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusSelectField";
import UserAvatar from "@/components/common/UserAvatar";
import PaginationFooter from "@/components/common/PaginationFooter";
import ProjectActionsMenu from "./ProjectActionsMenu";
import { PERMISSIONS } from "@/constant/global";

const PROJECTS_PER_PAGE = 3;

const parseDueDate = (dateValue) => {
  if (!dateValue) return null;

  // Handles both ISO strings ("2026-05-30T00:00:00.000Z") and plain dates ("2026-05-30")
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
};

const formatDueDate = (dateValue, withYear = true) => {
  const parsed = parseDueDate(dateValue);
  if (!parsed) return "No due date";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
};

const isProjectOverdue = (project) => {
  if (!project?.dueDate || project?.status === "COMPLETED") return false;

  const deadline = parseDueDate(project.dueDate);
  if (!deadline) return false;

  return deadline.getTime() < Date.now();
};

const ProjectList = ({
  openCreateProjectModal,
  searchQuery,
  beginProjectEdit,
  beginProjectDelete,
  permissions,
}) => {
  const projectResponse = useGetProjectsQuery();
  const { data: projects = [], isLoading, isError, error } = projectResponse;
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);

  const canUpdateProjects = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.UPDATE_PROJECTS,
  ]);

  const canDeleteProjects = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.DELETE_PROJECTS,
  ]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) => {
      const assigneeText = (project.assignees ?? [])
        .map((assignee) => assignee.firstName)
        .join(" ")
        .toLowerCase();

      return [
        project.name,
        project.description,
        project.status,
        project.dueDate,
        assigneeText,
      ].some((text) =>
        String(text ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [projects, searchQuery]);

  const totalProjectPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  );

  const activeProjectPage = clampPage(projectCurrentPage, totalProjectPages);

  const paginatedProjects = useMemo(() => {
    const startIndex = (activeProjectPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [filteredProjects, activeProjectPage]);

  return (
    <>
      <div className="space-y-5 p-4 sm:p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <IconLoader className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading projects...</p>
            </div>
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to load projects"
            description={
              error?.data?.message ||
              "Something went wrong while fetching projects. Please try again."
            }
            icon={IconFolders}
            actionLabel="Retry"
            onAction={() => window.location.reload()}
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Try a different search or add a new project to get started."
            icon={IconFolders}
            actionLabel="Create Project"
            onAction={openCreateProjectModal}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedProjects.map((project) => {
              const projectAssignees = project.assignees ?? [];

              return (
                <Card
                  key={project._id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <StatusBadge status={project.status} size="sm" />
                      <ProjectActionsMenu
                        project={project}
                        onEdit={beginProjectEdit}
                        onDelete={beginProjectDelete}
                        canEdit={canUpdateProjects}
                        canDelete={canDeleteProjects}
                      />
                    </div>

                    <h3 className="text-base font-semibold tracking-tight">
                      {project.name}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-2.5 py-2 text-[11px]">
                      <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                        <IconFileDescriptionFilled className="size-3.5" />
                        Tasks
                      </span>
                      <span className="font-semibold text-foreground">
                        {project.taskCount}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <IconCalendar className="size-3.5" />
                        {formatDueDate(project.dueDate, false)}
                        {isProjectOverdue(project) ? (
                          <Badge
                            variant="outline"
                            className="border-destructive/30 bg-destructive/10 px-1.5 py-0 text-[9px] text-destructive"
                          >
                            Overdue
                          </Badge>
                        ) : null}
                      </div>

                      {projectAssignees.length > 0 ? (
                        <div className="flex -space-x-2">
                          {projectAssignees.slice(0, 3).map((assignee) => (
                            <UserAvatar
                              key={`${project._id}-${assignee._id}`}
                              size="sm"
                              firstName={assignee.firstName}
                              lastName={assignee.lastName}
                              className="ring-2 ring-background"
                            />
                          ))}
                          {projectAssignees.length > 3 ? (
                            <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-border bg-background text-[11px] font-semibold text-muted-foreground ring-2 ring-background">
                              +{projectAssignees.length - 3}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          No assignees
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      {!isLoading && !isError && filteredProjects.length > 0 ? (
        <PaginationFooter
          currentPage={activeProjectPage}
          totalPages={totalProjectPages}
          totalItems={filteredProjects.length}
          itemsPerPage={PROJECTS_PER_PAGE}
          onPageChange={setProjectCurrentPage}
          itemLabel="projects"
          showWhenSinglePage
        />
      ) : null}
    </>
  );
};

export default ProjectList;
