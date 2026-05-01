import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconRoute } from "@tabler/icons-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const journey = [
  {
    step: "01",
    title: "Sign Up & Set Up",
    description:
      "Create your account, set up your workspace, and invite team members with the right roles and permissions.",
  },
  {
    step: "02",
    title: "Plan Your Projects",
    description:
      "Create projects, define goals, and break work into clearly owned tasks with priorities and due dates.",
  },
  {
    step: "03",
    title: "Track & Deliver",
    description:
      "Move tasks through status stages, monitor project progress in real time, and keep your team aligned.",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const WorkflowJourney = () => {
  return (
    <section
      id="workflow"
      className="animate-in delay-200 duration-700 fade-in slide-in-from-bottom-3"
    >
      <Card className="border-border/50 bg-card/60 p-6 shadow-sm backdrop-blur md:p-10">
        {/* Section header */}
        <div className="flex flex-col gap-3">
          <Badge
            variant="outline"
            className="w-fit gap-1.5 border-primary/30 bg-primary/8 text-[11px] font-semibold tracking-wider text-primary uppercase"
          >
            <IconRoute className="size-3" />
            How It Works
          </Badge>
          <h2 className="max-w-lg text-2xl font-bold tracking-tight md:text-3xl">
            From sign-up to delivery,{" "}
            <span className="text-muted-foreground">in three simple steps</span>
          </h2>
        </div>

        {/* Step cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {journey.map((step, index) => (
            <Card
              key={step.title}
              className="group relative rounded-xl border-border/50 bg-background/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
              {/* Connector line between cards on desktop */}
              {index < journey.length - 1 && (
                <div className="pointer-events-none absolute top-8 -right-2 hidden h-px w-4 bg-border/60 md:block" />
              )}

              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-xs font-bold text-primary transition-colors group-hover:bg-primary/18">
                  {step.step}
                </span>
                <p className="text-sm leading-tight font-semibold">
                  {step.title}
                </p>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default WorkflowJourney;
