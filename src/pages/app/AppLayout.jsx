import { useEffect, useMemo } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  IconBuildingSkyscraper,
  IconChecklist,
  IconLayoutDashboard,
  IconLogout2,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";

import ThemeToggleButton from "@/components/common/theme-toggle-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    description: "Overview and metrics",
    path: "/app/dashboard",
    Icon: IconLayoutDashboard,
  },
  {
    title: "Projects",
    description: "Delivery pipelines",
    path: "/app/projects",
    Icon: IconBuildingSkyscraper,
  },
  {
    title: "Tasks",
    description: "Execution board",
    path: "/app/tasks",
    Icon: IconChecklist,
  },
  {
    title: "Team",
    description: "People and roles",
    path: "/app/team",
    Icon: IconUsers,
  },
];

function WorkspaceSidebar({ onNavigate, onOpenProfile, onLogout }) {
  const { isCollapsed } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to="/home"
          onClick={onNavigate}
          className={cn(
            "group flex min-w-0 items-center gap-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/35 p-2 transition-colors duration-500 hover:bg-sidebar-accent",
            isCollapsed && "lg:justify-center"
          )}
        >
          <img
            src="/branding/next-flow-mark.svg"
            alt="Next Flow"
            className="size-8 shrink-0 rounded-md border border-sidebar-border/70 bg-sidebar"
          />
          <div className={cn("min-w-0", isCollapsed && "lg:hidden")}>
            <p className="truncate text-[13px] font-semibold tracking-tight">
              Next Flow
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              Workspace Console
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "lg:sr-only")}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => (
                <SidebarMenuItem
                  key={item.title}
                  className="animate-in duration-700 fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${90 + index * 80}ms` }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    title={item.title}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[13px] font-medium transition-all duration-700 ease-out",
                        isActive
                          ? "border-sidebar-primary/30 bg-sidebar-primary/14 text-sidebar-primary shadow-[0_10px_24px_-18px_var(--color-sidebar-primary)]"
                          : "border-transparent text-sidebar-foreground/80 hover:border-sidebar-border/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isCollapsed && "lg:justify-center lg:px-1.5"
                      )
                    }
                  >
                    <item.Icon className="size-3.5 shrink-0 transition-transform duration-500 group-hover:scale-110" />
                    <div className={cn("min-w-0", isCollapsed && "lg:hidden")}>
                      <p className="truncate leading-none">{item.title}</p>
                      <p className="mt-0.5 truncate text-[10px] text-sidebar-foreground/60">
                        {item.description}
                      </p>
                    </div>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pt-1.5">
        <Card
          className={cn(
            "animate-in rounded-xl border-sidebar-border/70 bg-sidebar-accent/40 p-2.5 text-sidebar-foreground shadow-none transition-transform duration-700 fade-in slide-in-from-bottom-2 hover:-translate-y-0.5",
            isCollapsed && "lg:p-2"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "lg:justify-center"
            )}
          >
            <span className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-primary/25 bg-sidebar-primary/12 text-[11px] font-semibold text-sidebar-primary">
              WA
              <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-sidebar bg-emerald-500" />
            </span>

            <div className={cn("min-w-0", isCollapsed && "lg:hidden")}>
              <p className="truncate text-xs font-semibold">Workspace Admin</p>
              <p className="truncate text-[11px] text-sidebar-foreground/65">
                Product Owner
              </p>
            </div>
          </div>

          <div
            className={cn("mt-2.5 grid gap-1.5", isCollapsed && "lg:hidden")}
          >
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-1.5 rounded-lg px-2 text-xs text-sidebar-foreground/85 hover:bg-sidebar-accent"
              onClick={onOpenProfile}
            >
              <IconUserCircle className="size-3.5" />
              Profile
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-1.5 rounded-lg border-sidebar-border bg-sidebar px-2 text-xs hover:bg-sidebar-accent"
              onClick={onLogout}
            >
              <IconLogout2 className="size-3.5" />
              Logout
            </Button>
          </div>

          {isCollapsed ? (
            <Button
              variant="outline"
              size="icon-sm"
              className="mt-2 hidden border-sidebar-border bg-sidebar hover:bg-sidebar-accent lg:inline-flex"
              title="Logout"
              onClick={onLogout}
            >
              <IconLogout2 className="size-3.5" />
            </Button>
          ) : null}
        </Card>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function WorkspaceFrame({ pageMeta, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, setMobileOpen } = useSidebar();
  const HeaderIcon = pageMeta.Icon || IconLayoutDashboard;

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile, location.pathname, setMobileOpen]);

  return (
    <div className="relative min-h-svh w-full overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_9%_8%,rgba(14,165,233,0.10),transparent_36%),radial-gradient(circle_at_88%_12%,rgba(109,40,217,0.10),transparent_34%)]" />

      <div className="relative flex min-h-svh w-full">
        <WorkspaceSidebar
          onNavigate={() => {
            if (isMobile) {
              setMobileOpen(false);
            }
          }}
          onOpenProfile={() => {
            navigate("/app/team");
            if (isMobile) {
              setMobileOpen(false);
            }
          }}
          onLogout={onLogout}
        />

        <SidebarInset>
          <header className="sticky top-0 z-30 px-3 pt-2.5 md:px-4 md:pt-3">
            <div className="rounded-xl border border-border/70 bg-background/85 px-3 py-2.5 shadow-sm backdrop-blur-xl md:px-4">
              <div className="flex items-center gap-2.5">
                <SidebarTrigger />

                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <HeaderIcon className="size-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold tracking-tight">
                      {pageMeta.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {pageMeta.description}
                    </p>
                  </div>
                </div>

                <ThemeToggleButton className="ml-auto rounded-md" />
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 px-3 pt-3 pb-3 md:px-4 md:pt-4 md:pb-4">
            <Card className="min-h-full border-border/70 bg-card/65 p-3 shadow-sm md:p-5">
              <div className="min-h-full animate-in duration-700 fade-in slide-in-from-bottom-2">
                <Outlet />
              </div>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const pageMeta = useMemo(() => {
    const active = navigationItems.find((item) =>
      location.pathname.startsWith(item.path)
    );

    if (active) {
      return {
        title: active.title,
        description: active.description,
        Icon: active.Icon,
      };
    }

    return {
      title: "Workspace",
      description: "Operations and delivery control",
      Icon: IconLayoutDashboard,
    };
  }, [location.pathname]);

  const handleLogout = () => {
    window.localStorage.removeItem("nexflow:mock-auth");
    navigate("/login");
  };

  return (
    <SidebarProvider defaultOpen>
      <WorkspaceFrame pageMeta={pageMeta} onLogout={handleLogout} />
    </SidebarProvider>
  );
}

export default AppLayout;
