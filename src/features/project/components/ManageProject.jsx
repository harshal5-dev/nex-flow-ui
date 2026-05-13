import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, isValid, parseISO } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePickerField from "@/components/common/DatePickerField";
import StatusSelectField from "@/components/common/StatusSelectField";
import RequiredMark from "@/components/common/RequiredMark";
import {
  IconEdit,
  IconFolders,
  IconLoader,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_STATUSES } from "../constants/project.constant";
import { Button } from "@/components/ui/button";
import AssigneeMultiSelect from "./AssigneeMultiSelect";
import {
  useCreateProjectMutation,
  useGetLookupUsersQuery,
  useUpdateProjectMutation,
} from "../api/projectApi";
import { toast } from "sonner";

const normalizeDueDate = (dateValue) => {
  if (!dateValue) return "";

  // Handle ISO strings like "2026-05-30T00:00:00.000Z" → "2026-05-30"
  const parsed = parseISO(dateValue);
  if (isValid(parsed)) return format(parsed, "yyyy-MM-dd");

  // Pass through if already in yyyy-MM-dd or other format
  return dateValue;
};

const resolveProjectDefaults = (project) => {
  return {
    _id: project?._id ?? "",
    name: project?.name ?? "",
    description: project?.description ?? "",
    status: project?.status ?? "",
    dueDate: normalizeDueDate(project?.dueDate),
    assignees: Array.isArray(project?.assignees)
      ? project.assignees.map((a) => a?._id ?? a).filter(Boolean)
      : [],
  };
};

const ManageProject = ({ closeProjectModal, selectedProject }) => {
  const isEditMode = !!selectedProject?._id;
  const projectForm = useForm({
    mode: "onBlur",
    defaultValues: resolveProjectDefaults(selectedProject),
  });
  const {
    data: users = [],
    isLoading: usersLoading,
    isFetching: usersFetching,
  } = useGetLookupUsersQuery();
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const [submitError, setSubmitError] = useState("");
  const isSubmitting = creating || updating;

  // Reset form when selectedProject changes
  useEffect(() => {
    projectForm.reset(resolveProjectDefaults(selectedProject));
  }, [selectedProject, projectForm]);

  const handleProjectSubmit = async (values) => {
    setSubmitError("");

    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      status: values.status,
      dueDate: values.dueDate,
      assignees: Array.from(new Set(values.assignees ?? [])).filter(Boolean),
    };

    try {
      if (values._id) {
        const response = await updateProject({
          _id: values._id,
          ...payload,
        }).unwrap();
        toast.success(
          response?.message ||
            `${values.name || "Project"} updated successfully.`
        );
      } else {
        const response = await createProject(payload).unwrap();
        toast.success(
          response?.message ||
            `${values.name || "Project"} created successfully.`
        );
      }
      closeProjectModal();
    } catch (error) {
      setSubmitError(
        error?.data?.message ||
          "Unable to save project right now. Please try again."
      );
    }
  };

  return (
    <Form {...projectForm}>
      <form
        onSubmit={projectForm.handleSubmit(handleProjectSubmit)}
        className="grid gap-5"
        noValidate
      >
        <FormField
          control={projectForm.control}
          name="name"
          rules={{
            required: "Project name is required.",
            minLength: {
              value: 3,
              message: "Project name should be at least 3 characters.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Project Name
                <RequiredMark />
              </FormLabel>
              <div className="group relative">
                <IconFolders className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <FormControl>
                  <Input
                    placeholder="e.g. Product Analytics Revamp"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={projectForm.control}
          name="description"
          rules={{
            validate: (value) =>
              !value?.trim() ||
              value.trim().length >= 12 ||
              "Description should be at least 12 characters if provided.",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <div className="group relative">
                <IconEdit className="pointer-events-none absolute top-3 left-3.5 size-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <FormControl>
                  <Textarea
                    placeholder="Describe the goals, scope, and expected outcome..."
                    className="min-h-24 pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={projectForm.control}
            name="status"
            rules={{
              validate: (value) =>
                PROJECT_STATUSES.includes(value) ||
                "Project status is required.",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Project Status
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <StatusSelectField
                    value={field.value}
                    onChange={field.onChange}
                    statuses={PROJECT_STATUSES}
                    placeholder="Select status"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={projectForm.control}
            name="dueDate"
            rules={{ required: "Due date is required." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Due Date
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select due date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={projectForm.control}
          name="assignees"
          rules={{
            validate: (value) =>
              (Array.isArray(value) && value.length > 0) ||
              "Assign at least one user.",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-flex items-center gap-1.5">
                <IconUser className="size-4" />
                Assign Users
                <RequiredMark />
              </FormLabel>
              <FormControl>
                <AssigneeMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={users}
                  isLoading={usersLoading || usersFetching}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError && (
          <p className="text-xs font-medium text-destructive">{submitError}</p>
        )}

        <div className="mt-1 flex items-center justify-end gap-2 border-t border-border/50 pt-4">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={closeProjectModal}
          >
            Cancel
          </Button>
          <Button type="submit" className="gap-1.5" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <IconLoader className="size-4 animate-spin" />
                {isEditMode ? "Saving..." : "Creating..."}
              </>
            ) : isEditMode ? (
              <>
                <IconEdit className="size-4" />
                Update Project
              </>
            ) : (
              <>
                <IconPlus className="size-4" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManageProject;
