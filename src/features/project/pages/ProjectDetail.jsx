import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconChecklist,
  IconFolders,
  IconUsers,
} from "@tabler/icons-react";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PERMISSIONS } from "@/constant/global";
import { selectAuthPermissions } from "@/features/auth";
import ManageProject from "@/features/project/components/ManageProject";
import ProjectDetailHeader from "@/features/project/components/details/ProjectDetailHeader";
import ProjectDetailSkeleton from "@/features/project/components/details/ProjectDetailSkeleton";
import ProjectMembersTab from "@/features/project/components/details/ProjectMembersTab";
import ProjectOverviewTab from "@/features/project/components/details/ProjectOverviewTab";
import ProjectTasksTab from "@/features/project/components/details/ProjectTasksTab";
import {
  calculateTaskStats,
  getUserDisplayName,
  normalizeProject,
  normalizeTask,
} from "@/features/project/components/details/projectDetail.utils";
import {
  useCreateProjectTaskMutation,
  useDeleteTaskMutation,
  useGetProjectByIdQuery,
  useGetProjectsQuery,
  useGetProjectTasksQuery,
  useUpdateTaskMutation,
} from "@/features/project/api/projectApi";
import AddTaskSheet from "@/features/tasks/components/AddTaskSheet";
import EditTaskSheet from "@/features/tasks/components/EditTaskSheet";
import TaskDetailSheet from "@/features/tasks/components/TaskDetailSheet";
import { hasAnyPermission } from "@/lib/utils";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { projectId = "" } = useParams();
  const permissions = useSelector(selectAuthPermissions);

  const [activeTab, setActiveTab] = useState("overview");

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToView, setTaskToView] = useState(null);

  const projectByIdQuery = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });
  const projectsQuery = useGetProjectsQuery();
  const projectTasksQuery = useGetProjectTasksQuery(projectId, {
    skip: !projectId,
  });

  const [createProjectTask, { isLoading: isCreatingTask }] =
    useCreateProjectTaskMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeletingTask }] = useDeleteTaskMutation();

  const canViewTasks = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.VIEW_TASKS,
  ]);

  const canCreateTask = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.CREATE_TASKS,
  ]);

  const canUpdateTask = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.UPDATE_TASKS,
  ]);

  const canDeleteTask = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.DELETE_TASKS,
  ]);

  const canEditProject = hasAnyPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.UPDATE_PROJECTS,
  ]);

  const isProjectLoading =
    projectByIdQuery.isLoading ||
    (projectsQuery.isLoading && !projectByIdQuery.data);

  const rawProjectFromList = useMemo(
    () =>
      (projectsQuery.data ?? []).find(
        (project) => (project?._id || project?.id) === projectId
      ) || null,
    [projectsQuery.data, projectId]
  );

  const rawProject = projectByIdQuery.data || rawProjectFromList;
  const project = useMemo(() => normalizeProject(rawProject), [rawProject]);

  const membersById = useMemo(() => {
    const index = {};
    (project?.members ?? []).forEach((member) => {
      if (member?._id) {
        index[member._id] = member;
      }
    });
    return index;
  }, [project]);

  const normalizedTasks = useMemo(() => {
    const sourceTasks =
      projectTasksQuery.data && Array.isArray(projectTasksQuery.data)
        ? projectTasksQuery.data
        : (project?.tasks ?? []);

    return sourceTasks
      .map((task) =>
        normalizeTask(task, {
          membersById,
          projectId: project?._id,
        })
      )
      .filter(Boolean);
  }, [projectTasksQuery.data, project, membersById]);

  const stats = useMemo(
    () => calculateTaskStats(normalizedTasks),
    [normalizedTasks]
  );

  const editableProject = useMemo(() => {
    if (!rawProject || !project) return null;

    return {
      ...rawProject,
      assignees: Array.isArray(rawProject.assignees)
        ? rawProject.assignees
        : project.members,
    };
  }, [rawProject, project]);

  const refreshProjectData = async () => {
    await Promise.all([
      projectByIdQuery.refetch(),
      projectTasksQuery.refetch(),
      projectsQuery.refetch(),
    ]);
  };

  const handleCreateTask = async (values, form) => {
    const payload = {
      title: values.title?.trim(),
      description: values.description?.trim() || "",
      status: values.status,
      priority: values.priority,
      assignees: Array.from(new Set(values.assignees ?? [])).filter(Boolean),
      ...(values.dueDate ? { dueDate: values.dueDate } : {}),
    };

    try {
      const response = await createProjectTask({
        projectId,
        ...payload,
      }).unwrap();

      toast.success(response?.message || "Task created successfully.");
      form.reset();
      setIsAddTaskOpen(false);
      await refreshProjectData();
    } catch (error) {
      toast.error(error?.data?.message || "Unable to create task right now.");
    }
  };

  const handleUpdateTask = async (values, form) => {
    if (!taskToEdit?._id) return;

    const payload = {
      title: values.title?.trim(),
      description: values.description?.trim() || "",
      status: values.status,
      priority: values.priority,
      assignees: Array.from(new Set(values.assignees ?? [])).filter(Boolean),
      dueDate: values.dueDate || null,
    };

    try {
      const response = await updateTask({
        taskId: taskToEdit._id,
        projectId,
        ...payload,
      }).unwrap();

      toast.success(response?.message || "Task updated successfully.");
      form.reset(values);
      setTaskToEdit(null);
      await refreshProjectData();
    } catch (error) {
      toast.error(error?.data?.message || "Unable to update task.");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete?._id) return;

    try {
      const response = await deleteTask({
        taskId: taskToDelete._id,
        projectId,
      }).unwrap();

      toast.success(response?.message || "Task deleted successfully.");
      if (taskToView?._id === taskToDelete._id) {
        setTaskToView(null);
      }
      setTaskToDelete(null);
      await refreshProjectData();
    } catch (error) {
      toast.error(error?.data?.message || "Unable to delete task.");
    }
  };

  const handleTaskStatusChange = async (task, status) => {
    if (!task?._id || !canUpdateTask) return;

    try {
      await updateTask({
        taskId: task._id,
        projectId,
        status,
      }).unwrap();

      await refreshProjectData();
      toast.success("Task status updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Unable to update task status.");
    }
  };

  if (isProjectLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="The selected project is unavailable or you do not have access to it."
        actionLabel="Back to Projects"
        onAction={() => navigate("/app/projects")}
      />
    );
  }

  console.log(project, "project");

  return (
    <main className="space-y-6">
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/app/projects")}
        >
          <IconArrowLeft className="size-4" />
          Back to Projects
        </Button>
      </div>

      <ProjectDetailHeader
        project={project}
        canEditProject={canEditProject}
        canCreateTask={canCreateTask}
        onEditProject={() => setIsProjectModalOpen(true)}
        onAddTask={() => setIsAddTaskOpen(true)}
      />

      {!canViewTasks ? (
        <Card className="border-border/50 bg-card/70 p-8 text-center text-muted-foreground">
          You do not have permission to view tasks for this project.
        </Card>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="inline-flex flex-wrap justify-start gap-1 border border-border/40 bg-background/70 p-1">
            <TabsTrigger value="overview" className="gap-1.5">
              <IconFolders className="size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-1.5">
              <IconChecklist className="size-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-1.5">
              <IconUsers className="size-4" />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <ProjectOverviewTab project={project} stats={stats} />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <ProjectTasksTab
              tasks={normalizedTasks}
              members={project.members}
              canCreateTask={canCreateTask}
              canUpdateTask={canUpdateTask}
              canDeleteTask={canDeleteTask}
              onAddTask={() => setIsAddTaskOpen(true)}
              onViewTask={setTaskToView}
              onEditTask={setTaskToEdit}
              onDeleteTask={setTaskToDelete}
              onStatusChange={handleTaskStatusChange}
            />
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <ProjectMembersTab
              members={project.members}
              tasks={normalizedTasks}
              onViewMemberTasks={(member) => {
                setActiveTab("tasks");
                toast.info(
                  `Switched to Tasks for ${getUserDisplayName(member)}.`
                );
              }}
              canManageMembers={false}
            />
          </TabsContent>
        </Tabs>
      )}

      <AddTaskSheet
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        members={project.members}
        onCreate={handleCreateTask}
        isLoading={isCreatingTask}
      />

      <EditTaskSheet
        open={Boolean(taskToEdit)}
        onOpenChange={(open) => {
          if (!open) setTaskToEdit(null);
        }}
        task={taskToEdit}
        members={project.members}
        onSave={handleUpdateTask}
        isLoading={isUpdatingTask}
      />

      <TaskDetailSheet
        open={Boolean(taskToView)}
        onOpenChange={(open) => {
          if (!open) setTaskToView(null);
        }}
        task={taskToView}
        projectName={project.name}
        canUpdate={canUpdateTask}
        canDelete={canDeleteTask}
        onStatusChange={(status) => handleTaskStatusChange(taskToView, status)}
        onEdit={() => {
          setTaskToEdit(taskToView);
          setTaskToView(null);
        }}
        onDelete={() => {
          setTaskToDelete(taskToView);
          setTaskToView(null);
        }}
      />

      <Dialog
        open={isProjectModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsProjectModalOpen(false);
            return;
          }
          setIsProjectModalOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details and members.
            </DialogDescription>
          </DialogHeader>
          <ManageProject
            closeProjectModal={() => {
              setIsProjectModalOpen(false);
              refreshProjectData();
            }}
            selectedProject={editableProject}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(taskToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeletingTask) {
            setTaskToDelete(null);
          }
        }}
        title="Delete this task?"
        description={`This will remove "${taskToDelete?.title || "this task"}" from the project.`}
        confirmLabel="Delete Task"
        onConfirm={handleDeleteTask}
        isLoading={isDeletingTask}
      />
    </main>
  );
};

export default ProjectDetail;
