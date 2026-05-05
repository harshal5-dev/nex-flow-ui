import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconChecklist,
  IconLayoutDashboard,
  IconUsers,
} from "@tabler/icons-react";

/* ------------------------------------------------------------------ */
/*  FEATURE COLOR MAP                                                  */
/* ------------------------------------------------------------------ */

const featureAccents = [
  "border-primary/25 bg-primary/10 text-primary group-hover:bg-primary/15",
  "border-info/25 bg-info/10 text-info group-hover:bg-info/15",
  "border-success/25 bg-success/10 text-success group-hover:bg-success/15",
];

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    Icon: IconUsers,
    title: "Team Management",
    description:
      "Invite workspace members and assign roles — Admin, Manager, or Developer — with scoped permissions that control exactly what each person can see and do.",
    tag: "People",
  },
  {
    Icon: IconLayoutDashboard,
    title: "Project Tracking",
    description:
      "Create and monitor projects from kickoff to delivery. Track progress, ownership, and health status across all active workstreams in one dashboard.",
    tag: "Projects",
  },
  {
    Icon: IconChecklist,
    title: "Task Workflows",
    description:
      "Break projects into actionable tasks, set priorities and due dates, and move work through clear status stages — To Do, In Progress, Review, and Done.",
    tag: "Tasks",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const Features = () => {
  return (
    <section
      id="features"
      className="grid animate-in gap-4 delay-100 duration-700 fade-in slide-in-from-bottom-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
    >
      {features.map((feature, index) => (
        <Card
          key={feature.title}
          className="group border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              {/* Colored icon */}
              <div
                className={`inline-flex size-11 items-center justify-center rounded-xl border transition-colors duration-300 ${
                  featureAccents[index % featureAccents.length]
                }`}
              >
                <feature.Icon className="size-5" />
              </div>
              <Badge
                variant="outline"
                className="mt-1 border-border/60 text-[10px] font-medium text-muted-foreground"
              >
                {feature.tag}
              </Badge>
            </div>
            <CardTitle className="mt-3.5 text-base font-semibold tracking-tight">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-[13px] leading-relaxed">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default Features;
