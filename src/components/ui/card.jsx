import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <section
      data-slot="card"
      className={cn(
        "rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <header
      data-slot="card-header"
      className={cn("grid gap-1.5 p-6 pb-2", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h2
      data-slot="card-title"
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <footer
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-2", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
