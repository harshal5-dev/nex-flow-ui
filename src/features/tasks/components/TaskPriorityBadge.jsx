import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TASK_PRIORITY,
  TASK_PRIORITY_BADGE_STYLES,
  TASK_PRIORITY_LABELS,
  normalizeTaskPriority,
} from "@/features/tasks/constants/task.constant";

const TaskPriorityBadge = ({ priority, className }) => {
  const resolvedPriority = normalizeTaskPriority(priority);

  return (
    <Badge
      variant="outline"
      className={cn(
        "border px-2 py-0 text-[11px] font-semibold",
        TASK_PRIORITY_BADGE_STYLES[resolvedPriority] ||
          TASK_PRIORITY_BADGE_STYLES[TASK_PRIORITY.MEDIUM],
        className
      )}
    >
      {TASK_PRIORITY_LABELS[resolvedPriority] ||
        TASK_PRIORITY_LABELS[TASK_PRIORITY.MEDIUM]}
    </Badge>
  );
};

export default TaskPriorityBadge;
