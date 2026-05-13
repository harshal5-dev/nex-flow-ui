import { useCallback, useMemo, useState } from "react";
import {
  IconCheck,
  IconCircleDashed,
  IconLoader2,
  IconCircleCheck,
  IconArchive,
  IconCircleX,
  IconEye,
  IconEyePause,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Status configuration registry.
 * Each status has a label, icon, color classes, and optional description.
 * Easily extensible — just add new entries here.
 */
const STATUS_CONFIG = {
  // ── Project statuses ──
  IN_PROGRESS: {
    label: "In Progress",
    icon: IconLoader2,
    dot: "bg-info",
    text: "text-info",
    bg: "bg-info/8 border-info/20",
    activeBg: "bg-info/12 border-info/30",
    badge: "border-info/25 bg-info/10 text-info",
    description: "Work is actively underway",
  },
  COMPLETED: {
    label: "Completed",
    icon: IconCircleCheck,
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/8 border-success/20",
    activeBg: "bg-success/12 border-success/30",
    badge: "border-success/25 bg-success/10 text-success",
    description: "All work has been finished",
  },
  ARCHIVED: {
    label: "Archived",
    icon: IconArchive,
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    bg: "bg-muted/30 border-muted-foreground/15",
    activeBg: "bg-muted/50 border-muted-foreground/25",
    badge: "border-muted-foreground/25 bg-muted/35 text-muted-foreground",
    description: "Stored for reference only",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: IconCircleX,
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/6 border-destructive/15",
    activeBg: "bg-destructive/10 border-destructive/25",
    badge: "border-destructive/25 bg-destructive/10 text-destructive",
    description: "This work has been cancelled",
  },
  ON_HOLD: {
    label: "On Hold",
    icon: IconEyePause,
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/8 border-warning/20",
    activeBg: "bg-warning/12 border-warning/30",
    badge: "border-warning/25 bg-warning/10 text-warning",
    description: "Paused and awaiting action",
  },
  REVIEW: {
    label: "Review",
    icon: IconEye,
    dot: "bg-pending",
    text: "text-pending",
    bg: "bg-pending/8 border-pending/20",
    activeBg: "bg-pending/12 border-pending/30",
    badge: "border-pending/25 bg-pending/10 text-pending",
    description: "Under review and evaluation",
  },
  // ── Generic fallbacks ──
  Planning: {
    label: "Planning",
    icon: IconCircleDashed,
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    bg: "bg-muted/30 border-muted-foreground/15",
    activeBg: "bg-muted/50 border-muted-foreground/25",
    badge: "border-muted-foreground/25 bg-muted/35 text-muted-foreground",
    description: "Scoping and planning phase",
  },
};

const DEFAULT_STATUS_CONFIG = {
  label: "Unknown",
  icon: IconCircleDashed,
  dot: "bg-muted-foreground",
  text: "text-muted-foreground",
  bg: "bg-muted/30 border-muted-foreground/15",
  activeBg: "bg-muted/50 border-muted-foreground/25",
  badge: "border-muted-foreground/25 bg-muted/35 text-muted-foreground",
  description: "",
};

/**
 * Returns the config for a status value. Can be used externally for badges, etc.
 */
function getStatusConfig(status) {
  return STATUS_CONFIG[status] ?? DEFAULT_STATUS_CONFIG;
}

/**
 * Standalone status badge component for read-only display usage.
 */
export function StatusBadge({ status, className, size = "default", ...props }) {
  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold tracking-wide",
        config.badge,
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "default" && "px-2.5 py-0.5 text-[11px]",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block shrink-0 rounded-full",
          config.dot,
          size === "sm" ? "size-1.5" : "size-2"
        )}
      />
      {config.label}
    </Badge>
  );
}

/**
 * A premium status select field using shadcn Popover.
 * Displays statuses with color-coded icons, dots, and descriptions.
 *
 * @param {string}   value          – Currently selected status value (e.g. "IN_PROGRESS").
 * @param {Function} onChange       – Called with the new status value.
 * @param {string[]} statuses       – Array of status keys to show (e.g. from PROJECT_STATUSES).
 * @param {string}   [placeholder]  – Placeholder text when no status is selected.
 * @param {boolean}  [disabled]     – Disable the trigger.
 * @param {string}   [className]    – Extra classes on the trigger.
 */
const StatusSelectField = ({
  value,
  onChange,
  statuses = [],
  placeholder = "Select status",
  disabled = false,
  className,
  ...triggerProps
}) => {
  const [open, setOpen] = useState(false);
  const [dialogContainer, setDialogContainer] = useState(null);

  const resolvedContainer = dialogContainer ?? undefined;

  const handleTriggerRef = useCallback((node) => {
    if (node) {
      const dialog = node.closest("[data-slot='dialog-content']") ?? null;
      setDialogContainer(dialog);
    }
  }, []);

  const statusOptions = useMemo(
    () =>
      statuses.map((statusKey) => ({
        value: statusKey,
        ...getStatusConfig(statusKey),
      })),
    [statuses]
  );

  const selectedConfig = value ? getStatusConfig(value) : null;

  const handleSelect = (statusValue) => {
    onChange(statusValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={handleTriggerRef}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "group relative h-9 w-full justify-start gap-2.5 rounded-md border-border/60 bg-transparent px-3 text-left font-normal shadow-xs transition-all hover:bg-muted/40",
            open && "border-ring ring-3 ring-ring/50",
            value && selectedConfig && "border-border",
            className
          )}
          {...triggerProps}
        >
          {selectedConfig ? (
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block size-2 shrink-0 rounded-full",
                  selectedConfig.dot
                )}
              />
              <span className={cn("text-sm font-medium", selectedConfig.text)}>
                {selectedConfig.label}
              </span>
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        container={resolvedContainer}
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-(--anchor-width) max-w-[92vw] min-w-56 p-1.5"
      >
        <div className="flex flex-col gap-0.5">
          {statusOptions.map((option) => {
            const isSelected = value === option.value;
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "group/status flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all outline-none",
                  isSelected
                    ? cn("border", option.activeBg)
                    : "border border-transparent hover:bg-muted/50"
                )}
              >
                {/* Status icon */}
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    isSelected
                      ? cn(option.bg, option.text)
                      : "border-border/50 bg-muted/30 text-muted-foreground group-hover/status:border-border"
                  )}
                >
                  <Icon className="size-4" />
                </span>

                {/* Label + description */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      isSelected ? option.text : "text-foreground"
                    )}
                  >
                    {option.label}
                  </p>
                  {option.description ? (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {option.description}
                    </p>
                  ) : null}
                </div>

                {/* Selected check */}
                {isSelected ? (
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full",
                      option.text
                    )}
                  >
                    <IconCheck className="size-3.5" strokeWidth={3} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StatusSelectField;
