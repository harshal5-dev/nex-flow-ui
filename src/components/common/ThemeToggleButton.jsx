import { IconMoonStars, IconSunHigh } from "@tabler/icons-react";

import useTheme from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

function getResolvedTheme(theme) {
  if (theme !== "system") {
    return theme;
  }

  if (typeof window === "undefined") {
    return "light";
  }

  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark";
  }

  return "light";
}

function ThemeToggleButton({ className }) {
  const { theme, setTheme } = useTheme();
  const isDark = getResolvedTheme(theme) === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex size-9 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-transparent p-0 text-foreground transition-all duration-300 ease-out hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="relative inline-grid size-5 place-items-center">
        <IconSunHigh
          stroke={1.9}
          className={`absolute transition-all duration-300 ease-out ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 group-hover:scale-110"
          }`}
        />
        <IconMoonStars
          stroke={1.9}
          className={`absolute transition-all duration-300 ease-out ${
            isDark
              ? "rotate-0 scale-100 opacity-100 group-hover:scale-110"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

export default ThemeToggleButton;
