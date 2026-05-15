import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent className="left-auto right-0 top-0 h-svh max-w-full translate-x-0 translate-y-0 rounded-none sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task for this project.
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskSheet;
