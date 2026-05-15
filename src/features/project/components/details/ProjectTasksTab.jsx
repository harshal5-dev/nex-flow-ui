import TaskTable from "@/features/tasks/components/TaskTable";

const ProjectTasksTab = ({
  tasks,
  members,
  canCreateTask,
  canUpdateTask,
  canDeleteTask,
  onAddTask,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  return (
    <TaskTable
      tasks={tasks}
      members={members}
      canCreateTask={canCreateTask}
      canUpdateTask={canUpdateTask}
      canDeleteTask={canDeleteTask}
      onAddTask={onAddTask}
      onViewTask={onViewTask}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onStatusChange={onStatusChange}
    />
  );
};

export default ProjectTasksTab;
