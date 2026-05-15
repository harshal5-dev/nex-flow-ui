import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { IconEdit } from "@tabler/icons-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "@/features/tasks/components/TaskForm";
import { taskFormDefaults } from "@/features/tasks/constants/taskForm.constant";

const normalizeDate = (dateValue) => {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const buildDefaultsFromTask = (task) => {
  if (!task) return taskFormDefaults;

  const assignedToId =
    task?.assignedTo?._id ||
    task?.assignedTo?.id ||
    (Array.isArray(task?.assignees) ? task.assignees[0]?._id || task.assignees[0]?.id : "");

  return {
    title: task.title || task.name || "",
    description: task.description || "",
    status: task.status || taskFormDefaults.status,
    priority: task.priority || taskFormDefaults.priority,
    assignedTo: assignedToId || taskFormDefaults.assignedTo,
    dueDate: normalizeDate(task.dueDate),
  };
};

const EditTaskSheet = ({
  open,
  onOpenChange,
  task,
  members = [],
  onSave,
  isLoading = false,
}) => {
  const initialValues = useMemo(() => buildDefaultsFromTask(task), [task]);

  const form = useForm({ defaultValues: initialValues });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset(initialValues);
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="left-auto right-0 top-0 h-svh max-w-full translate-x-0 translate-y-0 rounded-none border-l border-border/60 bg-card/90 p-0 sm:max-w-[540px]">
        <DialogHeader className="border-b border-border/40 bg-muted/20 px-5 py-4">
          <div className="mb-1 inline-flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <IconEdit className="size-4 text-primary" />
            </span>
            <DialogTitle className="text-lg">Edit Task</DialogTitle>
          </div>
          <DialogDescription>
            Update task details and assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[calc(100svh-92px)] overflow-y-auto px-5 py-4">
          <TaskForm
            form={form}
            members={members}
            onSubmit={async (values) => {
              await onSave(values, form);
            }}
            onCancel={() => onOpenChange(false)}
            submitLabel="Save Changes"
            isSubmitting={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskSheet;
