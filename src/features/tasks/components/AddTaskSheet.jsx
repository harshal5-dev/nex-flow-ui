import { IconPlus } from "@tabler/icons-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "@/features/tasks/components/TaskForm";
import { taskFormDefaults } from "@/features/tasks/constants/taskForm.constant";
import { useForm } from "react-hook-form";

const AddTaskSheet = ({
  open,
  onOpenChange,
  members = [],
  onCreate,
  isLoading = false,
}) => {
  const form = useForm({ defaultValues: taskFormDefaults });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset(taskFormDefaults);
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="top-0 right-0 left-auto h-svh max-w-full translate-x-0 translate-y-0 rounded-none border-l border-border/60 bg-card/90 p-0 sm:max-w-135">
        <DialogHeader className="border-b border-border/40 bg-muted/20 px-5 py-4">
          <div className="mb-1 inline-flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <IconPlus className="size-4 text-primary" />
            </span>
            <DialogTitle className="text-lg">Create Task</DialogTitle>
          </div>
          <DialogDescription>
            Add a new task in this project workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[calc(100svh-92px)] overflow-y-auto px-5">
          <TaskForm
            form={form}
            members={members}
            onSubmit={async (values) => {
              await onCreate(values, form);
            }}
            onCancel={() => onOpenChange(false)}
            submitLabel="Create Task"
            isSubmitting={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskSheet;
