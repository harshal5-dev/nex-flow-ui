import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

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

  return {
    title: task.title || task.name || "",
    description: task.description || "",
    status: task.status || taskFormDefaults.status,
    priority: task.priority || taskFormDefaults.priority,
    assignees: Array.isArray(task.assignees)
      ? task.assignees.map((assignee) => assignee?._id || assignee).filter(Boolean)
      : [],
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
      <DialogContent className="left-auto right-0 top-0 h-svh max-w-full translate-x-0 translate-y-0 rounded-none sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details and assignments.
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskSheet;
