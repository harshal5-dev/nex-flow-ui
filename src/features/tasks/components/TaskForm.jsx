import { useCallback, useMemo, useState } from "react";
import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconFlag,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";

import DatePickerField from "@/components/common/DatePickerField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  TASK_PRIORITY,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from "@/features/tasks/constants/task.constant";
import { cn } from "@/lib/utils";

const TASK_PRIORITY_ORDER = [
  TASK_PRIORITY.LOW,
  TASK_PRIORITY.MEDIUM,
  TASK_PRIORITY.HIGH,
  TASK_PRIORITY.URGENT,
];

const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.emailId ||
  "User";

const AssigneeSearchSelect = ({
  value,
  onChange,
  options,
  placeholder = "Search and select member",
  ...triggerProps
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dialogContainer, setDialogContainer] = useState(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return options;

    return options.filter((option) =>
      [option.label, option.subtitle]
        .filter(Boolean)
        .some((text) => String(text).toLowerCase().includes(query))
    );
  }, [options, searchValue]);

  const resolvedCollisionAvoidance = useMemo(() => {
    if (!dialogContainer) return undefined;

    return {
      side: "shift",
      align: "shift",
      fallbackAxisSide: "none",
    };
  }, [dialogContainer]);

  const handleTriggerRef = useCallback((node) => {
    if (node) {
      const dialog = node.closest("[data-slot='dialog-content']") ?? null;
      setDialogContainer(dialog);
    }
  }, []);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          ref={handleTriggerRef}
          type="button"
          variant="outline"
          role="combobox"
          className={cn(
            "h-10 w-full justify-between bg-background/80 font-normal shadow-none",
            !selectedOption && "text-muted-foreground",
            open && "border-primary/50 ring-2 ring-primary/20"
          )}
          {...triggerProps}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        container={dialogContainer ?? undefined}
        side="bottom"
        align="start"
        sideOffset={6}
        collisionAvoidance={resolvedCollisionAvoidance}
        className="w-(--anchor-width) max-w-[92vw] min-w-72 p-0"
      >
        <div className="border-b border-border/40 p-2.5">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by name or email..."
              className="h-8 rounded-md border-border/50 bg-muted/30 pl-8 text-xs shadow-none"
              onKeyDown={(event) => event.stopPropagation()}
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1.5">
          {filteredOptions.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No users found.
            </p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                    isSelected
                      ? "border border-primary/20 bg-primary/6"
                      : "border border-transparent hover:bg-muted/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4.5 shrink-0 items-center justify-center rounded-md border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 bg-background"
                    )}
                  >
                    {isSelected ? (
                      <IconCheck className="size-3" strokeWidth={3} />
                    ) : null}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {option.label}
                    </p>
                    {option.subtitle ? (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {option.subtitle}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const TaskForm = ({
  form,
  members = [],
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isSubmitting = false,
}) => {
  const memberOptions = useMemo(
    () =>
      members.map((member) => ({
        value: member._id,
        label: getUserDisplayName(member),
        subtitle: member.emailId,
      })),
    [members]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4 rounded-2xl border border-border/50 bg-muted/15 p-4">
          <FormField
            control={form.control}
            name="title"
            rules={{ required: "Task title is required." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Task Title
                  <span className="ml-1 text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Build login API"
                    className="h-10 bg-background/80"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write task details..."
                    className="min-h-24 bg-background/80"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            rules={{ required: "Status is required." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center gap-1.5">
                  <IconFlag className="size-4 text-muted-foreground" />
                  <span>
                    Status
                    <span className="ml-1 text-destructive">*</span>
                  </span>
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-10 w-full bg-background/80">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_STATUS_ORDER.map((status) => (
                      <SelectItem key={status} value={status}>
                        {TASK_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            rules={{ required: "Priority is required." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center gap-1.5">
                  <IconFlag className="size-4 text-muted-foreground" />
                  <span>
                    Priority
                    <span className="ml-1 text-destructive">*</span>
                  </span>
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-10 w-full bg-background/80">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_PRIORITY_ORDER.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {TASK_PRIORITY_LABELS[priority]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            rules={{
              validate: (value) => {
                if (!value) {
                  return "Assignee is required.";
                }
                const exists = memberOptions.some(
                  (option) => option.value === value
                );
                return exists || "Assigned user must be a project member.";
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center gap-1.5">
                  <IconUser className="size-4 text-muted-foreground" />
                  <span>
                    Assign To
                    <span className="ml-1 text-destructive">*</span>
                  </span>
                </FormLabel>
                <FormControl>
                  <AssigneeSearchSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={memberOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            rules={{
              validate: (value) => {
                if (!value) return "Due date is required.";
                const parsed = new Date(value);
                return (
                  !Number.isNaN(parsed.getTime()) || "Enter a valid due date."
                );
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center gap-1.5">
                  <IconCalendar className="size-4 text-muted-foreground" />
                  <span>
                    Due Date
                    <span className="ml-1 text-destructive">*</span>
                  </span>
                </FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Pick due date"
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-border/40 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
