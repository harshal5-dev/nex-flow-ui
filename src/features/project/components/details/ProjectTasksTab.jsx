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
  assigneeFilter,
  onAssigneeFilterChange,
}) => {
  return (
    <TaskTable
      key={`project-task-table-${assigneeFilter}`}
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
      assigneeFilter={assigneeFilter}
      onAssigneeFilterChange={onAssigneeFilterChange}
    />
  );
};

export default ProjectTasksTab;
