import { useState } from "react";
import { useSelector } from "react-redux";
import {
  IconEye,
  IconFolderPlus,
  IconFolders,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { selectAuthPermissions } from "@/features/auth";
import { hasAnyPermission } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ManageProject from "../components/ManageProject";
import ViewProject from "../components/ViewProject";
import { Input } from "@/components/ui/input";
import ProjectList from "../components/ProjectList";
import { PERMISSIONS } from "@/constant/global";
import { useDeleteProjectMutation } from "../api/projectApi";
import ProjectStates from "../components/ProjectStates";

const Projects = () => {
  const permissions = useSelector(selectAuthPermissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [viewingProject, setViewingProject] = useState(null);

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const canCreateProjects = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.CREATE_PROJECTS,
  ]);

  const canViewStates = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
  ]);

  const openCreateProjectModal = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  const beginProjectView = (project) => {
    setViewingProject(project);
  };

  const beginProjectEdit = (project) => {
    setViewingProject(null);
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const beginProjectDelete = (project) => {
    setDeleteError("");
    setProjectToDelete(project);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  const confirmDeleteProject = async () => {
    const projectId = projectToDelete?._id ?? projectToDelete?.id;
    if (!projectId) return;

    try {
      const response = await deleteProject(projectId).unwrap();
      toast.success(
        response?.message ||
          `${projectToDelete?.name || "Project"} removed successfully.`
      );
      setProjectToDelete(null);
      setDeleteError("");
    } catch (error) {
      setDeleteError(
        error?.data?.message ||
          `Unable to remove ${projectToDelete?.name || "project"} right now.`
      );
    }
  };

  const isEditing = Boolean(selectedProject?._id);

  return (
    <main className="flex w-full min-w-0 animate-in flex-col gap-6 duration-500 fade-in">
      <Card className="relative overflow-hidden border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -right-10 size-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <IconFolders className="size-5 text-primary" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Project Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Create, assign, and track projects with clear ownership and due
                dates.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {canViewStates && <ProjectStates />}

      <section>
        <Card className="overflow-hidden border-border/50 bg-card/60 shadow-sm backdrop-blur">
          <div className="border-b border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full sm:w-auto">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                  placeholder="Search projects..."
                  className="h-9 w-full border-border/50 bg-background/60 pl-9 text-sm shadow-sm sm:w-64"
                />
              </div>

              {canCreateProjects && (
                <Button
                  type="button"
                  className="shrink-0 gap-1.5"
                  onClick={openCreateProjectModal}
                >
                  <IconPlus className="size-4" />
                  <span className="hidden sm:inline">Add Project</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              )}
            </div>
          </div>

          <ProjectList
            openCreateProjectModal={openCreateProjectModal}
            searchQuery={searchQuery}
            beginProjectView={beginProjectView}
            beginProjectEdit={beginProjectEdit}
            beginProjectDelete={beginProjectDelete}
            permissions={permissions}
          />
        </Card>
      </section>

      <Dialog
        open={isProjectModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeProjectModal();
            return;
          }

          setIsProjectModalOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="pb-3">
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <IconFolderPlus className="size-4.5 text-primary" />
              </span>
              <DialogTitle className="text-xl">
                {isEditing ? "Update Project" : "Create New Project"}
              </DialogTitle>
            </div>
            <DialogDescription>
              Set project details and assign the right team members.
            </DialogDescription>
          </DialogHeader>

          <ManageProject
            closeProjectModal={closeProjectModal}
            selectedProject={selectedProject}
          />
        </DialogContent>
      </Dialog>

      {/* ── View Project Dialog ─────────────────────────────────────────── */}
      <Dialog
        open={Boolean(viewingProject)}
        onOpenChange={(open) => {
          if (!open) setViewingProject(null);
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader className="pb-2">
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-info/20 bg-info/10">
                <IconEye className="size-4.5 text-info" />
              </span>
              <div>
                <DialogTitle className="text-lg">Project Details</DialogTitle>
                <DialogDescription>
                  Full overview of this project and its resources.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ViewProject
            project={viewingProject}
            onClose={() => setViewingProject(null)}
            onEdit={beginProjectEdit}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setProjectToDelete(null);
            setDeleteError("");
          }
        }}
        title="Delete this project?"
        description={`This will remove "${projectToDelete?.name || "this project"}" from your workspace.`}
        errorMessage={deleteError}
        confirmLabel="Delete Project"
        onConfirm={confirmDeleteProject}
        isLoading={isDeleting}
      />
    </main>
  );
};

export default Projects;
