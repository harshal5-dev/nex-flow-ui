import { Link } from "react-router-dom";
import { IconArrowUpRight } from "@tabler/icons-react";

import AppLayout from "@/app/layouts/AppLayout";
import LogoBrand from "@/components/common/LogoBrand";
import ThemeToggleButton from "@/components/common/theme-toggle-button";

/* ── Stats shown in every left panel ──────────────────────────────── */
const PANEL_STATS = [
  { value: "3", label: "Core Modules" },
  { value: "5", label: "Task States" },
  { value: "10+", label: "UI Screens" },
];

/* ── Component ────────────────────────────────────────────────────── */
function AuthPageShell({
  badge,
  title,
  description,
  highlights = [],
  children,
}) {
  const normalizedHighlights = highlights.map((item) =>
    typeof item === "string"
      ? { title: item, description: "" }
      : { title: item.title, description: item.description ?? "" }
  );

  return (
    /* Reuse the same AppLayout so auth pages share the identical
       grid + top-gradient background as the rest of the app. */
    <AppLayout>
      <div className="relative mx-auto grid min-h-svh w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
        {/* ── Left info panel (desktop only) ──────────────────────── */}
        <div className="hidden rounded-3xl border border-border/60 bg-card p-8 shadow-sm lg:flex lg:flex-col lg:justify-between">
          {/* Top block */}
          <div>
            {/* Brand */}
            <LogoBrand
              size="md"
              subtitle="Project Management"
              className="mb-8"
            />

            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
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

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {PANEL_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-center"
                >
                  <p className="text-lg font-bold tabular-nums">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom block — highlight cards */}
          <div className="space-y-2.5">
            {normalizedHighlights.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-all duration-200 hover:border-primary/25 hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/8 text-[10px] font-bold text-primary">
                    0{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug font-semibold">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <IconArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/60 transition-colors duration-200 group-hover:text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: form panel ───────────────────────────────────── */}
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

          {/* Centered form */}
          <div className="flex flex-1 items-center justify-center">
            {children}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default AuthPageShell;
