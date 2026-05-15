import { cn } from "@/lib/utils";

function Progress({ className, value = 0, ...props }) {
  const safeValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), 100)
    : 0;

  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export { Progress };
