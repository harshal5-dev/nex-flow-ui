import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  IconCalendar,
  IconCircleCheck,
  IconFolderPlus,
  IconFolders,
  IconLoader,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { selectAuthPermissions } from "@/features/auth";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import ProjectList from "../components/ProjectList";

const Projects = () => {
  const permissions = useSelector(selectAuthPermissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const statCards = useMemo(() => {
    return [
      {
        label: "Total Projects",
        value: 2,
        Icon: IconFolders,
        color: "text-primary",
        bg: "border-primary/20 bg-primary/10",
      },
      {
        label: "Active",
        value: 1,
        Icon: IconLoader,
        color: "text-info",
        bg: "border-info/20 bg-info/10",
      },
      {
        label: "Completed",
        value: 3,
        Icon: IconCircleCheck,
        color: "text-success",
        bg: "border-success/20 bg-success/10",
      },
      {
        label: "Overdue",
        value: 0,
        Icon: IconCalendar,
        color: "text-destructive",
        bg: "border-destructive/20 bg-destructive/10",
      },
    ];
  }, []);

  const openCreateProjectModal = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  const beginProjectEdit = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const beginProjectDelete = (project) => {
    setProjectToDelete(project);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  const confirmDeleteProject = () => {
    if (!projectToDelete?.id) return;

    toast.success("Project removed successfully.");
    setProjectToDelete(null);
  };

  const isEditing = Boolean(selectedProject?.id);

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

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card
            key={item.label}
            className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3 p-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums">
                  {item.value}
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
                  item.bg
                )}
              >
                <item.Icon className={cn("size-5", item.color)} />
              </span>
            </div>
          </Card>
        ))}
      </section>

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

              <Button
                type="button"
                className="shrink-0 gap-1.5"
                onClick={openCreateProjectModal}
              >
                <IconPlus className="size-4" />
                <span className="hidden sm:inline">Add Project</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          <ProjectList
            openCreateProjectModal={openCreateProjectModal}
            searchQuery={searchQuery}
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

      <ConfirmationDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setProjectToDelete(null);
          }
        }}
        title="Delete this project?"
        description={`This will remove "${projectToDelete?.name || "this project"}" from your workspace.`}
        confirmLabel="Delete Project"
        onConfirm={confirmDeleteProject}
      />
    </main>
  );
};

export default Projects;
