import { Link } from "react-router-dom";
import { IconArrowUpRight } from "@tabler/icons-react";

import LogoBrand from "@/components/common/LogoBrand";
import ThemeToggleButton from "@/components/common/theme-toggle-button";

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
      {/* Page-level ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(109,40,217,0.18),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(196,181,253,0.16),transparent_36%),radial-gradient(circle_at_60%_85%,rgba(91,33,182,0.15),transparent_42%)]" />

      <div className="relative mx-auto grid min-h-svh w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
        {/* ── Left info panel ───────────────────────────────────────── */}
        <div className="relative hidden overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/12 via-card/95 to-card/80 p-8 shadow-xl backdrop-blur lg:flex lg:flex-col lg:justify-between">
          {/* Decorative glow blobs */}
          <div className="pointer-events-none absolute -top-24 -left-20 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-24 size-64 rounded-full bg-primary/10 blur-3xl" />
          {/* ── Top block: brand + badge + title + stats ── */}
          <div className="relative">
            {/* Brand row */}
            <LogoBrand
              size="md"
              subtitle="Project Management Platform"
              className="mb-8"
            />

            {/* Badge pill */}
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/12 px-3.5 py-1.5 text-xs font-semibold text-primary">
              {badge}
            </span>

            {/* Title */}
            <h1 className="mt-5 text-2xl leading-tight font-bold tracking-tight xl:text-3xl">
              {title}
            </h1>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {panelStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-primary/15 bg-background/50 px-3 py-2.5 text-center"
                >
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom block: highlight cards ── */}
          <div className="relative space-y-2.5">
            {normalizedHighlights.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-xl border border-primary/15 bg-background/40 px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-background/60"
              >
                <div className="flex items-start gap-3">
                  {/* Step chip */}
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[10px] font-bold text-primary">
                    0{index + 1}
                  </span>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug font-semibold">
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  {/* Arrow icon */}
                  <IconArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right children panel ──────────────────────────────────── */}
        <section className="flex min-h-full flex-col">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="rounded-lg p-1 transition-opacity hover:opacity-75"
            >
              <LogoBrand size="sm" subtitle={null} />
            </Link>
            <ThemeToggleButton />
          </div>

          {/* Form area */}
          <div className="flex flex-1 items-center justify-center">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPageShell;
