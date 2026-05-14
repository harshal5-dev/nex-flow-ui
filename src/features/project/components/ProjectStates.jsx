import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCalendar,
  IconCircleCheck,
  IconExclamationCircle,
  IconFolders,
  IconLoader,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useGetProjectStatsQuery } from "../api/projectApi";

const ProjectStates = () => {
  const {
    data: stats,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetProjectStatsQuery();

  const statCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: "Total Projects",
        value: stats.totalProjects ?? 0,
        Icon: IconFolders,
        color: "text-primary",
        bg: "border-primary/20 bg-primary/10",
      },
      {
        label: "Active",
        value: stats.activeProjects ?? 0,
        Icon: IconLoader,
        color: "text-info",
        bg: "border-info/20 bg-info/10",
      },
      {
        label: "Completed",
        value: stats.completedProjects ?? 0,
        Icon: IconCircleCheck,
        color: "text-success",
        bg: "border-success/20 bg-success/10",
      },
      {
        label: "Overdue",
        value: stats.overdueProjects ?? 0,
        Icon: IconCalendar,
        color: "text-destructive",
        bg: "border-destructive/20 bg-destructive/10",
      },
    ];
  }, [stats]);

  // Loading skeleton
  if (isLoading || isFetching) {
    return (
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur"
          >
            <div className="flex items-start justify-between gap-3 p-5">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-10" />
              </div>
              <Skeleton className="size-10 rounded-xl" />
            </div>
          </Card>
        ))}
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section>
        <Card className="flex items-center gap-4 rounded-2xl border-destructive/30 bg-destructive/5 px-6 py-5 shadow-sm backdrop-blur">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
            <IconExclamationCircle className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              Failed to load project stats
            </p>
            <p className="text-xs text-muted-foreground">
              {error?.data?.message ||
                "Something went wrong while fetching statistics. Please try refreshing."}
            </p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((item) => (
        <Card
          key={item.label}
          className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums">
                {item.value}
              </p>
            </div>

            <span
              className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
                item.bg
              )}
            >
              <item.Icon className={cn("size-5", item.color)} />
            </span>
          </div>
        </Card>
      ))}
    </section>
  );
};

export default ProjectStates;
