import { IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EmptyState = ({
  title,
  description,
  message,
  icon: Icon = IconSearch,
  actionLabel,
  onAction,
  actionVariant = "outline",
  className,
  compact = false,
}) => {
  const resolvedTitle = title ?? message ?? "No results found";
  const resolvedDescription =
    description ??
    (title && message
      ? message
      : "Try adjusting your filters or search criteria.");

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-xl border border-border/50 bg-muted/20",
        compact ? "px-4 py-8" : "px-6 py-10",
        className
      )}
    >
      <div className="pointer-events-none absolute -top-14 right-0 size-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative flex flex-col items-center justify-center gap-3 text-center">
        <span className="inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm">
          <Icon className="size-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {resolvedTitle}
          </p>
          {resolvedDescription && (
            <p className="text-xs text-muted-foreground">
              {resolvedDescription}
            </p>
          )}
        </div>
        {actionLabel && onAction && (
          <Button
            type="button"
            variant={actionVariant}
            size="sm"
            className="mt-1 rounded-lg"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
