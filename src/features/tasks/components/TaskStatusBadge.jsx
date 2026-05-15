import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TASK_STATUS,
  TASK_STATUS_BADGE_STYLES,
  TASK_STATUS_LABELS,
  normalizeTaskStatus,
} from "@/features/tasks/constants/task.constant";

const TaskStatusBadge = ({ status, className }) => {
  const resolvedStatus = normalizeTaskStatus(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "border px-2 py-0 text-[11px] font-semibold",
        TASK_STATUS_BADGE_STYLES[resolvedStatus] ||
          TASK_STATUS_BADGE_STYLES[TASK_STATUS.TODO],
        className
      )}
    >
      {TASK_STATUS_LABELS[resolvedStatus] || TASK_STATUS_LABELS[TASK_STATUS.TODO]}
    </Badge>
  );
};

export default TaskStatusBadge;
