import { cn } from "@/lib/utils";

/**
 * LogoBrand — universal brand mark used across the whole application.
 *
 * Props
 * ─────────────────────────────────────────────────────────────
 * size           "sm" | "md" | "lg"         default: "md"
 * subtitle       string | null/false         default: "Project Management"
 *                  Pass null/false to hide the subtitle entirely.
 * showText       boolean                     default: true
 *                  Set to false to render the logo icon only (collapsed sidebar).
 * className      string   — wrapper element classes
 * logoClassName  string   — overrides on the <img> element
 * nameClassName  string   — overrides on the name <p>
 * subClassName   string   — overrides on the subtitle <p>
 * ─────────────────────────────────────────────────────────────
 *
 * Usage examples
 * ─────────────────────────────────────────────────────────────
 * <LogoBrand />                                   // medium, with subtitle
 * <LogoBrand size="sm" subtitle={null} />         // icon + name, no subtitle
 * <LogoBrand size="lg" showText={false} />        // icon only
 * <LogoBrand size="sm" subtitle="Workspace" showText={!isCollapsed} />
 */

const SIZES = {
  sm: {
    img: "size-7 rounded-md",
    gap: "gap-2",
    name: "text-xs",
    sub: "text-[10px]",
  },
  md: {
    img: "size-9 rounded-lg",
    gap: "gap-2.5",
    name: "text-sm",
    sub: "text-[11px]",
  },
  lg: {
    img: "size-11 rounded-xl",
    gap: "gap-3",
    name: "text-base",
    sub: "text-xs",
  },
};

function LogoBrand({
  size = "md",
  subtitle = "Project Management",
  showText = true,
  className,
  logoClassName,
  nameClassName,
  subClassName,
}) {
  const s = SIZES[size] ?? SIZES.md;

  return (
    <div className={cn("flex shrink-0 items-center", s.gap, className)}>
      {/* ── Logo mark ── */}
      <img
        src="/branding/next-flow-mark.svg"
        alt="Next Flow"
        className={cn(
          "shrink-0 border border-border/60 bg-card object-contain shadow-sm",
          s.img,
          logoClassName
        )}
      />

      {/* ── Text block ── */}
      {showText && (
        <div className="min-w-0">
          <p
            className={cn(
              "truncate leading-none font-semibold tracking-tight",
              s.name,
              nameClassName
            )}
          >
            Next Flow
          </p>

          {subtitle && (
            <p
              className={cn(
                "mt-0.5 truncate leading-none text-muted-foreground",
                s.sub,
                subClassName
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default LogoBrand;
