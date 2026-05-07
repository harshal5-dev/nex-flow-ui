import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DataErrorState = ({
  title = "Something went wrong",
  description = "Unable to load data right now. Please try again.",
  onRetry,
  retryLabel = "Retry",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-8 text-center",
        className
      )}
    >
      <div className="pointer-events-none absolute -top-10 right-0 size-28 rounded-full bg-destructive/10 blur-2xl" />
      <div className="relative flex flex-col items-center justify-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
          <IconAlertTriangle className="size-5" />
        </span>
        <p className="text-sm font-semibold text-destructive">{title}</p>
        <p className="max-w-sm text-xs text-destructive/80">{description}</p>
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-1 h-8 gap-1.5 rounded-lg border-destructive/30 bg-background text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            <IconRefresh className="size-3.5" />
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataErrorState;
