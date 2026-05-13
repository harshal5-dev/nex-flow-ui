import { forwardRef, useCallback, useMemo, useState } from "react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { IconCalendar, IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Parses a "yyyy-MM-dd" string into a local Date, returning null on failure.
 */
function toDate(value) {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

/**
 * Returns a friendly label like "Today", "Tomorrow", or "May 28, 2026".
 */
function friendlyDateLabel(date) {
  if (!date) return null;

  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";

  return format(date, "PPP");
}

const QUICK_PRESETS = [
  { label: "Today", offset: 0 },
  { label: "Tomorrow", offset: 1 },
  { label: "+3 days", offset: 3 },
  { label: "+1 week", offset: 7 },
  { label: "+2 weeks", offset: 14 },
  { label: "+1 month", offset: 30 },
];

const DatePickerField = forwardRef(function DatePickerField(
  {
    value = "",
    onChange,
    placeholder = "Pick a date",
    disabled = false,
    clearable = true,
    showPresets = true,
    className,
    calendarClassName,
    popoverClassName,
    popoverContainer,
    popoverSide,
    popoverAlign = "start",
    popoverSideOffset = 8,
    popoverCollisionAvoidance,
    ...buttonProps
  },
  ref
) {
  const [open, setOpen] = useState(false);
  const [dialogContainer, setDialogContainer] = useState(null);
  const selectedDate = useMemo(() => toDate(value), [value]);

  const resolvedContainer = popoverContainer ?? dialogContainer ?? undefined;
  const resolvedPopoverSide =
    popoverSide ?? (dialogContainer ? "top" : "bottom");
  const resolvedCollisionAvoidance = useMemo(() => {
    if (popoverCollisionAvoidance) return popoverCollisionAvoidance;
    if (!dialogContainer) return undefined;

    return {
      side: "shift",
      align: "shift",
      fallbackAxisSide: "none",
    };
  }, [popoverCollisionAvoidance, dialogContainer]);

  const handleButtonRef = useCallback(
    (node) => {
      if (node) {
        const dialog = node.closest("[data-slot='dialog-content']") ?? null;
        setDialogContainer(dialog);
      }

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  const emitDate = useCallback(
    (date) => {
      if (!onChange) return;
      onChange(date ? format(date, "yyyy-MM-dd") : "");
    },
    [onChange]
  );

  const handleDateSelect = (date) => {
    emitDate(date);
    setOpen(false);
  };

  const handlePreset = (offset) => {
    emitDate(addDays(new Date(), offset));
    setOpen(false);
  };

  const handleClear = (event) => {
    event?.stopPropagation();
    emitDate(null);
    setOpen(false);
  };

  const friendlyLabel = friendlyDateLabel(selectedDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={handleButtonRef}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "group/datepicker relative h-9 w-full justify-between gap-2 rounded-md border-border/60 bg-background/90 px-3 text-left font-normal shadow-none transition-colors hover:bg-muted/40",
            !selectedDate && "text-muted-foreground",
            open && "border-primary/50 ring-2 ring-primary/20",
            className
          )}
          {...buttonProps}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <IconCalendar
              className={cn(
                "size-4 shrink-0 transition-colors",
                open ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className="truncate text-sm">
              {friendlyLabel ?? placeholder}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1">
            {clearable && selectedDate ? (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Clear date"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleClear(e);
                }}
                className="inline-flex size-5 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover/datepicker:opacity-100 hover:bg-destructive/10 hover:text-destructive"
              >
                <IconX className="size-3" />
              </span>
            ) : null}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        container={resolvedContainer}
        side={resolvedPopoverSide}
        align={popoverAlign}
        sideOffset={popoverSideOffset}
        collisionAvoidance={resolvedCollisionAvoidance}
        className={cn("w-auto p-0", popoverClassName)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Quick presets sidebar */}
          {showPresets ? (
            <div className="flex flex-row gap-1 border-b border-border/50 p-2 sm:flex-col sm:border-r sm:border-b-0">
              <p className="mb-0.5 hidden px-2 pt-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase sm:block">
                Quick Pick
              </p>
              {QUICK_PRESETS.map((preset) => {
                const presetDate = addDays(new Date(), preset.offset);
                const isActive =
                  selectedDate &&
                  format(selectedDate, "yyyy-MM-dd") ===
                    format(presetDate, "yyyy-MM-dd");

                return (
                  <Button
                    key={preset.label}
                    type="button"
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-7 justify-start rounded-lg px-2.5 text-xs font-medium",
                      isActive &&
                        "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                    onClick={() => handlePreset(preset.offset)}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
          ) : null}

          {/* Calendar */}
          <div className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={handleDateSelect}
              className={cn(
                "rounded-xl [--cell-size:--spacing(8)]",
                calendarClassName
              )}
            />

            {/* Footer with selected date display */}
            <div className="flex items-center justify-between border-t border-border/40 px-3 pt-2 pb-1">
              <p className="text-xs text-muted-foreground">
                {selectedDate ? (
                  <>
                    <span className="font-medium text-foreground">
                      {format(selectedDate, "EEE, MMM d, yyyy")}
                    </span>
                  </>
                ) : (
                  "No date selected"
                )}
              </p>

              {clearable && selectedDate ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-destructive"
                  onClick={handleClear}
                >
                  <IconX className="size-3" />
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default DatePickerField;
