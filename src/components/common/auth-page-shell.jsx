import { Link } from "react-router-dom";
import { IconArrowUpRight } from "@tabler/icons-react";

import ThemeToggleButton from "@/components/common/theme-toggle-button";
import { Card } from "@/components/ui/card";

function AuthPageShell({
  badge,
  title,
  description,
  highlights = [],
  children,
}) {
  const panelStats = [
    { value: "5+", label: "Tenant Modules" },
    { value: "8", label: "Workflow States" },
    { value: "30+", label: "UI Blocks" },
  ];

  const normalizedHighlights = highlights.map((item) =>
    typeof item === "string"
      ? { title: item, description: "" }
      : {
          title: item.title,
          description: item.description ?? "",
        }
  );

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(109,40,217,0.22),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(196,181,253,0.2),transparent_36%),radial-gradient(circle_at_60%_85%,rgba(91,33,182,0.2),transparent_42%)]" />

      <div className="relative mx-auto grid min-h-svh w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
        <Card className="relative hidden animate-in overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-card/95 via-card/85 to-primary/10 p-8 shadow-xl backdrop-blur duration-700 fade-in slide-in-from-left-4 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -top-20 -left-16 size-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-10 size-56 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative">
            <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-foreground">
              {badge}
            </p>
            <h1 className="mt-5 text-3xl leading-tight font-semibold tracking-tight xl:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {description}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {panelStats.map((stat) => (
                <Card
                  key={stat.label}
                  className="rounded-xl border border-primary/15 bg-background/60 px-3 py-2"
                >
                  <p className="text-lg font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {stat.label}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative space-y-3">
            {normalizedHighlights.map((item, index) => (
              <Card
                key={item.title}
                className="group rounded-2xl border border-primary/15 bg-background/60 px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-background/75"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[10px] font-semibold text-primary dark:text-foreground">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <IconArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <section className="flex min-h-full flex-col">
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-medium"
            >
              <img
                src="/branding/next-flow-mark.svg"
                alt="Next Flow"
                className="size-8 rounded-md"
              />
              <span>Next Flow</span>
            </Link>
            <ThemeToggleButton />
          </div>

          <div className="flex flex-1 items-center justify-center">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPageShell;
