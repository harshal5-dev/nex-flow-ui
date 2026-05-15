import {
  IconAlertTriangle,
  IconCircleCheck,
  IconLoaderQuarter,
  IconStack2,
} from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STAT_ITEMS = [
  {
    key: "total",
    label: "Total Tasks",
    icon: IconStack2,
    gradient: "from-primary/15 to-primary/5",
    iconBg: "bg-primary/10 border-primary/15 text-primary",
    textColor: "text-primary",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: IconLoaderQuarter,
    gradient: "from-info/15 to-info/5",
    iconBg: "bg-info/10 border-info/15 text-info",
    textColor: "text-info",
  },
  {
    key: "completed",
    label: "Completed",
    icon: IconCircleCheck,
    gradient: "from-success/15 to-success/5",
    iconBg: "bg-success/10 border-success/15 text-success",
    textColor: "text-success",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: IconAlertTriangle,
    gradient: "from-destructive/15 to-destructive/5",
    iconBg: "bg-destructive/10 border-destructive/15 text-destructive",
    textColor: "text-destructive",
  },
];

function StatCard({ item, value }) {
  const IconComp = item.icon;

  const cardClasses = cn(
    "group relative overflow-hidden border-border/40 shadow-sm",
    "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
    "bg-linear-to-br " + item.gradient
  );

  const iconClasses = cn(
    "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border",
    "transition-transform duration-300 group-hover:scale-110",
    item.iconBg
  );

  const barClasses = cn(
    "absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-current opacity-20",
    "transition-transform duration-300 group-hover:scale-x-100",
    item.textColor
  );

  return (
    <Card key={item.label} className={cardClasses}>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {item.label}
          </p>
          <p
            className={cn(
              "mt-2 text-3xl font-bold tracking-tight tabular-nums",
              item.textColor
            )}
          >
            {value}
          </p>
        </div>

        <span className={iconClasses}>
          <IconComp className="size-5.5" />
        </span>
      </CardContent>

      <div className={barClasses} />
    </Card>
  );
}

const ProjectStatsCards = ({ stats }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_ITEMS.map((item) => (
        <StatCard key={item.key} item={item} value={stats?.[item.key] ?? 0} />
      ))}
    </div>
  );
};

export default ProjectStatsCards;
