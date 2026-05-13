import { useCallback, useMemo, useState } from "react";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY_VALUES = [];

/**
 * A fully-featured, reusable multi-select dropdown built on shadcn Popover.
 *
 * @param {Object}   props
 * @param {string[]} props.value              – Currently selected option values.
 * @param {Function} props.onChange            – Called with the new array of selected values.
 * @param {Array}    props.options             – Array of { value, label, subtitle?, icon?, ...rest }.
 * @param {string}   [props.placeholder]       – Trigger placeholder when nothing is selected.
 * @param {string}   [props.searchPlaceholder] – Input placeholder inside the dropdown.
 * @param {string}   [props.title]             – Header title shown above the list.
 * @param {string}   [props.emptyMessage]      – Text shown when no options match the search.
 * @param {boolean}  [props.isLoading]         – Show skeleton placeholders instead of options.
 * @param {boolean}  [props.disabled]          – Disable the trigger button.
 * @param {boolean}  [props.showSelectAll]     – Show "Select all / Clear" action buttons.
 * @param {number}   [props.maxPreview]        – Max badge previews shown on the trigger (default 3).
 * @param {Function} [props.renderOption]      – Custom render for each option row: (option, isSelected) => ReactNode.
 * @param {Function} [props.renderBadge]       – Custom render for each selected badge: (option) => ReactNode.
 * @param {Function} [props.filterFn]          – Custom filter: (option, query) => boolean.
 * @param {string}   [props.className]         – Extra classes on the trigger button.
 * @param {string}   [props.contentClassName]  – Extra classes on the popover content.
 * @param {Element}  [props.popoverContainer]  – Explicit portal container override.
 */
const MultiSelectField = ({
  value = [],
  onChange,
  options = [],
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  title,
  emptyMessage = "No options found.",
  isLoading = false,
  disabled = false,
  showSelectAll = true,
  maxPreview = 3,
  renderOption,
  renderBadge,
  filterFn,
  className,
  contentClassName,
  popoverContainer,
  ...triggerProps
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dialogContainer, setDialogContainer] = useState(null);
  const selectedValues = Array.isArray(value) ? value : EMPTY_VALUES;

  const resolvedContainer = popoverContainer ?? dialogContainer ?? undefined;
  const resolvedCollisionAvoidance = useMemo(() => {
    if (!dialogContainer) return undefined;

    return {
      side: "shift",
      align: "shift",
      fallbackAxisSide: "none",
    };
  }, [dialogContainer]);

  // Detect dialog container when trigger mounts (runs outside render)
  const handleTriggerRef = useCallback((node) => {
    if (node) {
      const dialog = node.closest("[data-slot='dialog-content']") ?? null;
      setDialogContainer(dialog);
    }
  }, []);

  // Build a lookup map from value → option
  const optionMap = useMemo(
    () =>
      options.reduce((acc, option) => {
        if (option?.value != null) acc[option.value] = option;
        return acc;
      }, {}),
    [options]
  );

  // Filtered options based on search
  const filteredOptions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return options;

    if (filterFn) {
      return options.filter((option) => filterFn(option, query));
    }

    return options.filter((option) =>
      [option.value, option.label, option.subtitle, option.description]
        .filter(Boolean)
        .some((text) => String(text).toLowerCase().includes(query))
    );
  }, [options, searchValue, filterFn]);

  const toggleOption = (optionValue) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((v) => v !== optionValue));
      return;
    }
    onChange([...selectedValues, optionValue]);
  };

  const handleSelectAll = () => onChange(options.map((option) => option.value));

  const handleClearAll = () => onChange([]);

  const previewItems = selectedValues.slice(0, maxPreview);
  const remainingCount = selectedValues.length - previewItems.length;

  // Default badge renderer
  const defaultRenderBadge = (option) => (
    <Badge
      variant="secondary"
      className="max-w-full truncate rounded-md border border-border/60 bg-background px-2 py-0.5 text-[11px] font-medium"
    >
      {option?.label ?? option?.value}
    </Badge>
  );

  // Default option renderer
  const defaultRenderOption = (option, isSelected) => (
    <div className="min-w-0">
      <p
        className={cn(
          "truncate text-sm font-medium",
          isSelected ? "text-foreground" : "text-foreground"
        )}
      >
        {option.label}
      </p>
      {option.subtitle ? (
        <p className="truncate text-[11px] text-muted-foreground">
          {option.subtitle}
        </p>
      ) : null}
    </div>
  );

  const resolvedRenderBadge = renderBadge ?? defaultRenderBadge;
  const resolvedRenderOption = renderOption ?? defaultRenderOption;

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
          disabled={disabled}
          className={cn(
            "group/multiselect relative h-auto min-h-10 w-full justify-between gap-2 rounded-md border-border/60 bg-background/90 px-3 py-2 text-left font-normal shadow-none transition-colors hover:bg-muted/40",
            open && "border-primary/50 ring-2 ring-primary/20",
            className
          )}
          {...triggerProps}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {selectedValues.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
            ) : (
              <>
                {previewItems.map((itemValue) => {
                  const option = optionMap[itemValue] ?? {
                    value: itemValue,
                    label: itemValue,
                  };

                  return (
                    <span key={itemValue}>{resolvedRenderBadge(option)}</span>
                  );
                })}
                {remainingCount > 0 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-md px-2 py-0.5 text-[11px]"
                  >
                    +{remainingCount} more
                  </Badge>
                ) : null}
              </>
            )}
          </div>

          {/* Count pill */}
          <Badge
            variant="secondary"
            className={cn(
              "h-6 shrink-0 rounded-full px-2 text-[11px] font-semibold tabular-nums transition-colors",
              selectedValues.length > 0
                ? "bg-primary/12 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {selectedValues.length}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        container={resolvedContainer}
        side="bottom"
        align="start"
        sideOffset={6}
        collisionAvoidance={resolvedCollisionAvoidance}
        className={cn(
          "w-(--anchor-width) max-w-[92vw] min-w-72 p-0",
          contentClassName
        )}
      >
        <div className="flex flex-col">
          {/* Search input */}
          <div className="border-b border-border/40 p-2.5">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 rounded-md border-border/50 bg-muted/30 pl-8 text-xs shadow-none focus-visible:ring-primary/30"
                onKeyDown={(event) => event.stopPropagation()}
                autoFocus
              />
            </div>
          </div>

          {/* Header bar with title + stats + actions */}
          <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
            <div className="min-w-0">
              {title ? (
                <p className="truncate text-[11px] font-semibold tracking-wide text-muted-foreground">
                  {title}
                </p>
              ) : null}
              <p className="text-[10px] text-muted-foreground">
                {selectedValues.length} of {options.length} selected
              </p>
            </div>

            {showSelectAll ? (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={handleSelectAll}
                  disabled={
                    options.length === 0 ||
                    selectedValues.length === options.length
                  }
                  className="h-6 px-2 text-[10px] font-medium"
                >
                  All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={handleClearAll}
                  disabled={selectedValues.length === 0}
                  className="h-6 px-2 text-[10px] font-medium text-muted-foreground hover:text-destructive"
                >
                  <IconX className="size-3" />
                  Clear
                </Button>
              </div>
            ) : null}
          </div>

          {/* Option list */}
          <div className="max-h-60 overflow-y-auto overscroll-contain p-1.5">
            {isLoading ? (
              <div className="space-y-1.5 p-1">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-6 text-center">
                <IconSearch className="size-5 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">{emptyMessage}</p>
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "group/option flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors outline-none",
                      isSelected
                        ? "border border-primary/20 bg-primary/6 hover:bg-primary/10"
                        : "border border-transparent hover:bg-muted/60"
                    )}
                  >
                    {/* Checkbox indicator */}
                    <span
                      className={cn(
                        "flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border/80 bg-background group-hover/option:border-primary/40"
                      )}
                    >
                      {isSelected ? (
                        <IconCheck className="size-3" strokeWidth={3} />
                      ) : null}
                    </span>

                    {/* Option content */}
                    <div className="min-w-0 flex-1">
                      {resolvedRenderOption(option, isSelected)}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {selectedValues.length > 0 ? (
            <div className="border-t border-border/40 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {selectedValues.length}
                </span>{" "}
                item{selectedValues.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectField;
