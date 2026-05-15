import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import TaskCard from "@/features/tasks/components/TaskCard";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  normalizeTaskStatus,
} from "@/features/tasks/constants/task.constant";

const TaskBoard = ({
  tasks = [],
  canCreateTask,
  canUpdateTask,
  canDeleteTask,
  onAddTask,
  onOpenTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const tasksByStatus = TASK_STATUS_ORDER.reduce((accumulator, status) => {
    accumulator[status] = tasks.filter(
      (task) => normalizeTaskStatus(task.status) === status
    );
    return accumulator;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Project Board</h3>
          <p className="text-xs text-muted-foreground">
            Move tasks by changing status from each card.
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task for this project."
          actionLabel={canCreateTask ? "Add Task" : undefined}
          onAction={canCreateTask ? onAddTask : undefined}
        />
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[1000px] grid-cols-5 gap-4">
            {TASK_STATUS_ORDER.map((status) => {
              const columnTasks = tasksByStatus[status] ?? [];

              return (
                <Card key={status} className="border-border/50 bg-muted/20">
                  <CardHeader className="space-y-1 px-3.5 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm font-semibold">
                        {TASK_STATUS_LABELS[status]}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px]">
                        {columnTasks.length}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 px-3.5 pb-3.5">
                    {columnTasks.length === 0 ? (
                      <div className="rounded-md border border-dashed border-border/60 bg-background/40 p-3 text-center text-xs text-muted-foreground">
                        No tasks in this status
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          canUpdate={canUpdateTask}
                          canDelete={canDeleteTask}
                          onOpenDetail={onOpenTask}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                          onStatusChange={onStatusChange}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
