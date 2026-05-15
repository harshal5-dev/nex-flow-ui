import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  normalizeTaskStatus,
} from "@/features/tasks/constants/task.constant";

const TaskStatusSelect = ({ value, onChange, disabled = false, className }) => {
  const resolvedValue = normalizeTaskStatus(value);

  return (
    <Select value={resolvedValue} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className || "h-8 w-[150px]"}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {TASK_STATUS_ORDER.map((status) => (
          <SelectItem key={status} value={status}>
            {TASK_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskStatusSelect;
