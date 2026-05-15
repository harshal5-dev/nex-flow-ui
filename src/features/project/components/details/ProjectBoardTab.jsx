import TaskBoard from "@/features/tasks/components/TaskBoard";

const ProjectBoardTab = ({
  tasks,
  canCreateTask,
  canUpdateTask,
  canDeleteTask,
  onAddTask,
  onOpenTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  return (
    <TaskBoard
      tasks={tasks}
      canCreateTask={canCreateTask}
      canUpdateTask={canUpdateTask}
      canDeleteTask={canDeleteTask}
      onAddTask={onAddTask}
      onOpenTask={onOpenTask}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onStatusChange={onStatusChange}
    />
  );
};

export default ProjectBoardTab;
