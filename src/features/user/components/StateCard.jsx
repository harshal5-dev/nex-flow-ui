import { useMemo } from "react";
import { useGetTeamStatesQuery } from "../api/userApi";
import {
  IconChecklist,
  IconKey,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DataErrorState from "@/components/common/DataErrorState";
import { cn } from "@/lib/utils";
import { STAT_COLORS } from "../constants/user.contants";

const StateCard = () => {
  const {
    data: teamStates,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetTeamStatesQuery();

  const hasTeamStates =
    teamStates && typeof teamStates === "object" && !Array.isArray(teamStates);
  const showStatsLoading =
    (isStatsLoading || isStatsFetching) && !hasTeamStates;
  const toCount = (value) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };

  const statCards = useMemo(
    () => [
      {
        label: "Team Members",
        value: toCount(teamStates?.totalUsers),
        Icon: IconUsers,
      },
      {
        label: "Roles Available",
        value: toCount(teamStates?.totalRoles),
        Icon: IconShieldCheck,
      },
      {
        label: "Permissions",
        value: toCount(teamStates?.totalPermissions),
        Icon: IconKey,
      },
      {
        label: "Multi-Role Members",
        value: toCount(teamStates?.totalMultiRoleMembers),
        Icon: IconChecklist,
      },
    ],
    [teamStates]
  );

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {showStatsLoading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={`team-stats-loading-${index}`}
            className="overflow-hidden border-border/50 bg-card/60 p-5 shadow-sm backdrop-blur"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-8 w-14 rounded-md" />
              </div>
              <Skeleton className="size-10 rounded-xl" />
            </div>
          </Card>
        ))
      ) : isStatsError ? (
        <div className="sm:col-span-2 xl:col-span-4">
          <DataErrorState
            title="Unable to load team stats"
            description="We could not fetch user and role metrics right now. Please retry."
            onRetry={refetchStats}
          />
        </div>
      ) : (
        statCards.map((item, index) => (
          <Card
            key={item.label}
            className="group relative overflow-hidden border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3 p-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums">
                  {String(item.value)}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
                  STAT_COLORS[index]?.bg ?? "border-primary/20 bg-primary/10"
                )}
              >
                <item.Icon
                  className={cn(
                    "size-5",
                    STAT_COLORS[index]?.color ?? "text-primary"
                  )}
                />
              </span>
            </div>
          </Card>
        ))
      )}
    </section>
  );
};

export default StateCard;
