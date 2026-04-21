import { Link } from "react-router-dom";

import ThemeToggleButton from "@/components/common/theme-toggle-button";
import { Card } from "@/components/ui/card";

function AuthPageShell({
  badge,
  title,
  description,
  highlights = [],
  children,
}) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(109,40,217,0.22),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(196,181,253,0.2),transparent_36%),radial-gradient(circle_at_60%_85%,rgba(91,33,182,0.2),transparent_42%)]" />

      <div className="relative mx-auto grid min-h-svh w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
        <Card className="hidden animate-in rounded-3xl bg-card/75 p-8 backdrop-blur fade-in slide-in-from-left-4 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-foreground">
              {badge}
            </p>
            <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          </div>

          <div className="space-y-3">
            {highlights.map((item) => (
              <Card
                key={item}
                className="rounded-2xl bg-background/60 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
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
