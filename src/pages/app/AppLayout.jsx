import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  IconBell,
  IconBuildingSkyscraper,
  IconChecklist,
  IconLayoutDashboard,
  IconMenu2,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

import ThemeToggleButton from "@/components/common/theme-toggle-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const navigationItems = [
  {
    title: "Dashboard",
    path: "/app/dashboard",
    Icon: IconLayoutDashboard,
  },
  {
    title: "Projects",
    path: "/app/projects",
    Icon: IconBuildingSkyscraper,
  },
  {
    title: "Tasks",
    path: "/app/tasks",
    Icon: IconChecklist,
  },
  {
    title: "Team",
    path: "/app/team",
    Icon: IconUsers,
  },
];

function SidebarContent({ onNavigate, onLogout }) {
  return (
    <div className="flex h-full flex-col text-sidebar-foreground">
      <Link
        to="/home"
        onClick={onNavigate}
        className="inline-flex items-center gap-2 rounded-md px-1 py-1"
      >
        <img
          src="/branding/next-flow-mark.svg"
          alt="Next Flow"
          className="size-8 rounded-md"
        />
        <div>
          <p className="text-sm font-semibold">Next Flow</p>
          <p className="text-[11px] text-sidebar-foreground/70">
            Mock Session Active
          </p>
        </div>
      </Link>

      <div className="mt-6">
        <p className="px-1 text-[11px] tracking-[0.16em] text-sidebar-foreground/70 uppercase">
          Navigation
        </p>
        <nav className="mt-2 grid gap-1.5">
          {navigationItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-sidebar-primary/30 bg-sidebar-primary/12 text-sidebar-foreground"
                    : "border-sidebar-border bg-sidebar/30 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`
              }
            >
              <item.Icon className="size-4 text-sidebar-primary" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>

      <Card className="mt-4 rounded-md border-sidebar-border bg-sidebar-accent/35 p-3 text-sidebar-foreground shadow-none">
        <p className="text-[11px] tracking-[0.16em] text-sidebar-foreground/70 uppercase">
          Workspace
        </p>
        <p className="mt-1 text-sm font-semibold">Acme Product Studio</p>
        <p className="mt-1 text-xs text-sidebar-foreground/70">
          Multi-tenant project and task operations.
        </p>
      </Card>

      <Button
        variant="outline"
        onClick={onLogout}
        className="mt-auto w-full border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent"
      >
        Logout Mock Session
      </Button>
    </div>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const mockSession = window.localStorage.getItem("nexflow:mock-auth");
    if (mockSession !== "true") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const pageTitle = useMemo(() => {
    const activeItem = navigationItems.find((item) =>
      location.pathname.startsWith(item.path)
    );

    return activeItem?.title ?? "Workspace";
  }, [location.pathname]);

  const handleMockLogout = () => {
    window.localStorage.removeItem("nexflow:mock-auth");
    navigate("/login");
  };

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="flex min-h-svh w-full">
        <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar px-4 py-4 lg:block">
          <SidebarContent onLogout={handleMockLogout} />
        </aside>

        <div className="flex min-h-svh flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
            <div className="flex h-14 items-center gap-2 px-3 md:px-4">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                onClick={openMobileSidebar}
                aria-label="Open navigation"
              >
                <IconMenu2 className="size-4" />
              </Button>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{pageTitle}</p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative hidden w-64 md:block">
                  <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, tasks, tenants..."
                    className="h-9 rounded-md bg-muted/30 pl-8"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Notifications"
                >
                  <IconBell className="size-4" />
                </Button>
                <ThemeToggleButton />
              </div>
            </div>

            <div className="border-t border-border/70 px-3 py-2 md:hidden">
              <div className="relative">
                <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects, tasks, tenants..."
                  className="h-9 rounded-md bg-muted/30 pl-8"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 p-3 md:p-4 lg:p-6">
            <div className="animate-in duration-700 fade-in slide-in-from-bottom-2">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation"
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobileSidebar}
        />

        <aside
          className={`relative h-full w-70 max-w-[85vw] border-r border-sidebar-border bg-sidebar px-4 py-4 text-sidebar-foreground shadow-xl transition-transform duration-300 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-3 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={closeMobileSidebar}
              aria-label="Close navigation"
            >
              <IconX className="size-4" />
            </Button>
          </div>

          <SidebarContent
            onNavigate={closeMobileSidebar}
            onLogout={handleMockLogout}
          />
        </aside>
      </div>
    </div>
  );
}

export default AppLayout;
