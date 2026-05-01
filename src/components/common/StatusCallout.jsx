import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const variantStyles = {
  success: {
    Icon: IconCircleCheck,
    container:
      "border-success/30 bg-linear-to-br from-success/12 via-success/6 to-background",
    iconWrap: "bg-success/15 text-success ring-success/25",
    title: "text-success",
  },
  error: {
    Icon: IconAlertOctagon,
    container:
      "border-destructive/30 bg-linear-to-br from-destructive/12 via-destructive/6 to-background",
    iconWrap: "bg-destructive/15 text-destructive ring-destructive/25",
    title: "text-destructive",
  },
  warning: {
    Icon: IconAlertTriangle,
    container:
      "border-warning/30 bg-linear-to-br from-warning/14 via-warning/7 to-background",
    iconWrap: "bg-warning/20 text-warning-foreground ring-warning/30",
    title: "text-warning-foreground",
  },
  info: {
    Icon: IconInfoCircle,
    container:
      "border-info/25 bg-linear-to-br from-info/12 via-info/5 to-background",
    iconWrap: "bg-info/15 text-info ring-info/25",
    title: "text-info",
  },
};

export function StatusCallout({
  variant = "info",
  title,
  message,
  details,
  action,
  onDismiss,
  className,
}) {
  const style = variantStyles[variant] || variantStyles.info;
  const Icon = style.Icon;

  const detailItems = Array.isArray(details)
    ? details.filter(Boolean)
    : details
      ? [details]
      : [];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "animate-fade-in-down relative overflow-hidden rounded-2xl border px-4 py-3 shadow-sm backdrop-blur-sm",
        style.container,
        className
      )}
    >
      <div className="relative flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ring-1",
            style.iconWrap
          )}
        >
          <Icon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          {title && (
            <p className={cn("text-sm font-semibold", style.title)}>{title}</p>
          )}
          {message && (
            <p className="mt-0.5 text-sm text-foreground/90">{message}</p>
          )}
          {detailItems.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {detailItems.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>

        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss message"
          >
            <IconX className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default StatusCallout;
