import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";

const AppSidebarMenu = ({ isCollapsed, onNavigate, navigationItems }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(isCollapsed && "lg:sr-only")}>
        Command Menu
      </SidebarGroupLabel>

      <SidebarGroupContent className="p-0">
        <SidebarMenu className="gap-1.5">
          {navigationItems.map((item, index) => (
            <SidebarMenuItem
              key={item.title}
              className="animate-in duration-700 fade-in slide-in-from-left-2"
              style={{ animationDelay: `${60 + index * 70}ms` }}
            >
              <NavLink
                to={item.path}
                title={item.title}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group/nav relative isolate flex items-center gap-2 overflow-hidden rounded-xl border px-2 py-1.5 text-xs font-medium transition-all duration-500 ease-out",
                    "hover:-translate-y-px hover:shadow-[0_10px_20px_-18px_var(--color-sidebar-primary)]",
                    isActive
                      ? "border-sidebar-primary/25 bg-linear-to-r from-sidebar-primary/16 via-sidebar-primary/8 to-sidebar-accent/50 text-sidebar-primary shadow-[0_12px_24px_-18px_var(--color-sidebar-primary)] dark:border-sidebar-primary/45 dark:from-sidebar-primary/30 dark:via-sidebar-primary/18 dark:to-sidebar-accent/85 dark:text-sidebar-foreground dark:shadow-[0_18px_36px_-26px_rgba(0,0,0,0.95)]"
                      : "border-transparent text-sidebar-foreground/75 hover:border-sidebar-border/70 hover:bg-sidebar/75 hover:text-sidebar-foreground dark:text-sidebar-foreground/70 dark:hover:border-sidebar-border dark:hover:bg-sidebar-accent/90 dark:hover:text-sidebar-foreground",
                    isCollapsed && "lg:justify-center lg:px-1.5"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {!isActive ? (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-sidebar-primary/20 to-transparent opacity-0 blur-[1px] transition-all duration-700 group-hover/nav:left-full group-hover/nav:opacity-100"
                      />
                    ) : null}

                    {isActive ? (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-sidebar-primary shadow-[0_0_10px_var(--color-sidebar-primary)]",
                          isCollapsed && "lg:hidden"
                        )}
                      />
                    ) : null}

                    <span
                      className={cn(
                        "relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-500",
                        isActive
                          ? "border-sidebar-primary/25 bg-sidebar-primary/15 text-sidebar-primary shadow-[0_8px_16px_-12px_var(--color-sidebar-primary)] dark:border-sidebar-primary/45 dark:bg-sidebar-primary/28 dark:text-sidebar-primary-foreground"
                          : "border-sidebar-border/70 bg-sidebar text-sidebar-foreground/65 group-hover/nav:border-sidebar-border group-hover/nav:bg-sidebar-accent dark:border-sidebar-border/80 dark:bg-sidebar dark:text-sidebar-foreground/60 dark:group-hover/nav:bg-sidebar-accent dark:group-hover/nav:text-sidebar-foreground",
                        isCollapsed && "lg:size-7"
                      )}
                    >
                      <item.Icon
                        className={cn(
                          "size-3.5 transition-transform duration-500",
                          isActive
                            ? "scale-110"
                            : "group-hover/nav:-translate-y-0.5 group-hover/nav:scale-105 group-hover/nav:-rotate-6"
                        )}
                      />
                    </span>

                    <span
                      className={cn(
                        "relative z-10 min-w-0 transition-transform duration-500",
                        isCollapsed && "lg:hidden"
                      )}
                    >
                      <span className="block truncate leading-none">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block truncate text-[9px]",
                          isActive
                            ? "text-sidebar-primary/75 dark:text-sidebar-primary-foreground/80"
                            : "text-sidebar-foreground/50 dark:text-sidebar-foreground/55"
                        )}
                      >
                        {item.caption}
                      </span>
                    </span>
                  </>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default AppSidebarMenu;
