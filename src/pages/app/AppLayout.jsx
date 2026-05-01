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
  IconChevronDown,
  IconChevronRight,
  IconChecklist,
  IconLayoutDashboard,
  IconLoader,
  IconLogout2,
  IconSearch,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";

import LogoBrand from "@/components/common/LogoBrand";
import ThemeToggleButton from "@/components/common/theme-toggle-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StatusCallout from "@/components/ui/status-callout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useDispatch } from "react-redux";
import { useSidebar } from "@/hooks/useSidebar";
import { cn, getApiErrorDetails } from "@/lib/utils";
import { useSignoutMutation } from "@/features/auth/api/authApi";
import { clearCredentials } from "@/features/auth/store/authSlice";

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
  {
    title: "Profile",
    description: "Personal settings",
    path: "/app/profile",
    Icon: IconUserCircle,
  },
];

function WorkspaceSidebar({
  onNavigate,
  onOpenProfile,
  onSignout,
  isSignoutLoading,
}) {
  const { isCollapsed } = useSidebar();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to="/app/dashboard"
          onClick={onNavigate}
          className={cn(
            "flex min-w-0 items-center rounded-xl border border-sidebar-border/60 bg-sidebar-accent/50 p-2.5 transition-all duration-200 hover:border-sidebar-primary/25 hover:bg-sidebar-accent/80",
            isCollapsed ? "lg:justify-center" : ""
          )}
        >
          <LogoBrand
            size="sm"
            subtitle="Workspace Console"
            showText={!isCollapsed}
            logoClassName="border-sidebar-border/50 bg-sidebar"
            nameClassName="text-sidebar-foreground"
            subClassName="text-sidebar-foreground/55"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "lg:sr-only")}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="rounded-xl border border-sidebar-border/50 bg-linear-to-b from-sidebar/50 to-sidebar-accent/20 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <SidebarMenu className="gap-1">
              {navigationItems.map((item, index) => {
                return (
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
                          "group/nav relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-2 py-2 text-[13px] font-medium transition-all duration-500 ease-out",
                          isActive
                            ? "border-sidebar-primary/25 bg-linear-to-r from-sidebar-primary/15 via-sidebar-primary/8 to-sidebar-accent/40 text-sidebar-primary shadow-[0_8px_24px_-16px_var(--color-sidebar-primary)]"
                            : "border-transparent bg-transparent text-sidebar-foreground/75 hover:border-sidebar-border/60 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                          isCollapsed && "lg:justify-center lg:px-1.5 lg:py-1.5"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive ? (
                            <span
                              aria-hidden
                              className={cn(
                                "pointer-events-none absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-sidebar-primary shadow-[0_0_8px_var(--color-sidebar-primary)]",
                                isCollapsed && "lg:hidden"
                              )}
                            />
                          ) : null}

                          <span
                            className={cn(
                              "relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-500",
                              isActive
                                ? "border-sidebar-primary/30 bg-sidebar-primary/15 text-sidebar-primary shadow-sm"
                                : "border-sidebar-border/60 bg-sidebar/80 text-sidebar-foreground/65 group-hover/nav:border-sidebar-border/80 group-hover/nav:bg-sidebar-accent/80 group-hover/nav:text-sidebar-foreground/85"
                            )}
                          >
                            <item.Icon
                              className={cn(
                                "size-3.5 transition-transform duration-500",
                                isActive
                                  ? "scale-110"
                                  : "group-hover/nav:scale-105"
                              )}
                            />
                          </span>

                          <div
                            className={cn(
                              "relative z-10 min-w-0",
                              isCollapsed && "lg:hidden"
                            )}
                          >
                            <p className="truncate leading-none">
                              {item.title}
                            </p>
                            <p
                              className={cn(
                                "mt-0.5 truncate text-[10px]",
                                isActive
                                  ? "text-sidebar-primary/70"
                                  : "text-sidebar-foreground/50"
                              )}
                            >
                              {item.description}
                            </p>
                          </div>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspace info badge */}
        {!isCollapsed && (
          <div className="mt-auto hidden animate-in px-1 duration-700 fade-in lg:block">
            <Card className="rounded-xl border-sidebar-border/40 bg-linear-to-br from-sidebar-primary/8 via-sidebar/60 to-sidebar-accent/30 p-3">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-sidebar-primary/80 uppercase">
                Workspace
              </p>
              <p className="mt-1 text-[12px] font-medium text-sidebar-foreground/90">
                Next Flow Platform
              </p>
              <p className="mt-0.5 text-[10px] text-sidebar-foreground/50">
                Multi-tenant SaaS
              </p>
            </Card>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="pt-1.5">
        <DropdownMenu onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open user menu"
              className={cn(
                "group relative flex w-full items-center gap-2.5 rounded-xl border border-sidebar-border/60 bg-linear-to-br from-sidebar-accent/40 via-sidebar/80 to-sidebar-accent/30 p-2.5 text-left text-sidebar-foreground shadow-none transition-all duration-500 hover:-translate-y-0.5 hover:border-sidebar-primary/25 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 focus-visible:outline-none",
                isCollapsed && "lg:justify-center lg:px-1.5"
              )}
            >
              <span className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-primary/25 bg-linear-to-br from-sidebar-primary/15 to-sidebar-primary/8 text-[11px] font-bold text-sidebar-primary shadow-sm">
                WA
                <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
              </span>

              <div className={cn("min-w-0 flex-1", isCollapsed && "lg:hidden")}>
                <p className="truncate text-xs font-semibold tracking-tight">
                  Workspace Admin
                </p>
                <p className="truncate text-[11px] text-sidebar-foreground/55">
                  Product Owner
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-md border border-sidebar-border/50 text-sidebar-foreground/60 transition-all duration-500 group-hover:border-sidebar-primary/25 group-hover:text-sidebar-primary",
                  isCollapsed && "lg:hidden"
                )}
              >
                <IconChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-500 ease-out",
                    isUserMenuOpen
                      ? "scale-110 rotate-180"
                      : "scale-100 rotate-0"
                  )}
                />
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isCollapsed ? "right" : "top"}
            align={isCollapsed ? "center" : "start"}
            sideOffset={10}
            className="w-60 border-border/60 bg-popover/95 text-popover-foreground shadow-xl backdrop-blur-xl"
          >
            <DropdownMenuLabel className="px-2.5 pt-2 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="relative inline-flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-[10px] font-bold text-primary">
                  WA
                  <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-popover bg-emerald-500" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold tracking-tight">
                    Workspace Admin
                  </p>
                  <p className="truncate text-[11px] font-normal text-muted-foreground">
                    admin@nexflow.local
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={onOpenProfile}
              className="gap-2.5 rounded-lg"
            >
              <span className="inline-flex size-6 items-center justify-center rounded-md border border-primary/20 bg-primary/8 text-primary">
                <IconUserCircle className="size-3.5" />
              </span>
              <span className="text-[13px]">View profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={onSignout}
              disabled={isSignoutLoading}
              className="gap-2.5 rounded-lg text-destructive focus:text-destructive"
            >
              <span className="inline-flex size-6 items-center justify-center rounded-md border border-destructive/20 bg-destructive/8">
                {isSignoutLoading ? (
                  <IconLoader className="size-3.5 animate-spin" />
                ) : (
                  <IconLogout2 className="size-3.5" />
                )}
              </span>
              <span className="text-[13px]">
                {isSignoutLoading ? "Signing out..." : "Sign out"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function WorkspaceFrame({
  pageMeta,
  onSignout,
  isSignoutLoading,
  signoutError,
  onDismissSignoutError,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, setMobileOpen } = useSidebar();
  const HeaderIcon = pageMeta.Icon || IconLayoutDashboard;

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile, location.pathname, setMobileOpen]);

  // Build breadcrumb segments from current path
  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return [];
    return segments.slice(1).map((seg) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
    }));
  }, [location.pathname]);

  return (
    <div className="relative min-h-svh w-full overflow-x-hidden bg-background text-foreground">
      {/* Square grid */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      {/* Subtle violet glow from the top — more muted than the landing page */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-5%,rgba(109,40,217,0.06),transparent)]" />

      <div className="relative flex min-h-svh w-full">
        <WorkspaceSidebar
          onNavigate={() => {
            if (isMobile) {
              setMobileOpen(false);
            }
          }}
          onOpenProfile={() => {
            navigate("/app/profile");
            if (isMobile) {
              setMobileOpen(false);
            }
          }}
          onSignout={onSignout}
          isSignoutLoading={isSignoutLoading}
        />

        <SidebarInset>
          <header className="sticky top-0 z-30 px-3 pt-2.5 md:px-4 md:pt-3">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/80 px-3 py-2.5 shadow-sm backdrop-blur-xl md:px-4">
              {/* Top accent line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

              <div className="flex items-center gap-2.5">
                <SidebarTrigger />

                <Separator
                  orientation="vertical"
                  className="hidden h-5 bg-border/50 md:block"
                />

                {/* Breadcrumb */}
                <div className="hidden min-w-0 items-center gap-1 text-xs text-muted-foreground md:flex">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={crumb.label} className="flex items-center gap-1">
                      {index > 0 && (
                        <IconChevronRight className="size-3 text-muted-foreground/50" />
                      )}
                      <span
                        className={cn(
                          index === breadcrumbs.length - 1
                            ? "font-medium text-foreground"
                            : "text-muted-foreground/70"
                        )}
                      >
                        {crumb.label}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Page title (mobile) */}
                <div className="flex min-w-0 items-center gap-2 md:hidden">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/8 text-primary">
                    <HeaderIcon className="size-3.5" />
                  </span>
                  <p className="truncate text-sm font-semibold tracking-tight">
                    {pageMeta.title}
                  </p>
                </div>

                {/* Right side header actions */}
                <div className="ml-auto flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Search"
                  >
                    <IconSearch className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="relative text-muted-foreground hover:text-foreground"
                    aria-label="Notifications"
                  >
                    <IconBell className="size-4" />
                    <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary shadow-[0_0_4px_var(--color-primary)]" />
                  </Button>

                  <Separator
                    orientation="vertical"
                    className="mx-0.5 hidden h-5 bg-border/50 sm:block"
                  />

                  <ThemeToggleButton className="rounded-md" />

                  {/* User avatar in header */}
                  <button
                    type="button"
                    className="hidden size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/8 text-[10px] font-bold text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/12 sm:inline-flex"
                    onClick={() => navigate("/app/profile")}
                    aria-label="Go to profile"
                  >
                    WA
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 px-3 pt-3 pb-3 md:px-4 md:pt-4 md:pb-4">
            {signoutError ? (
              <StatusCallout
                variant="error"
                title="Sign out failed"
                message={signoutError}
                onDismiss={onDismissSignoutError}
                className="mb-3"
              />
            ) : null}

            {/* Page title bar (desktop) */}
            <div className="mb-4 hidden items-center justify-between md:flex">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary shadow-sm">
                  <HeaderIcon className="size-4.5" />
                </span>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">
                    {pageMeta.title}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {pageMeta.description}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="gap-1.5 border-border/50 text-[10px] font-medium text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Online
              </Badge>
            </div>

            {/* Content area */}
            <div className="animate-in duration-500 fade-in slide-in-from-bottom-2">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Sign-out overlay */}
      {isSignoutLoading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md">
          <Card className="w-full max-w-sm overflow-hidden rounded-2xl border-border/50 bg-card/95 p-0 shadow-2xl">
            {/* Gradient accent */}
            <div className="h-1 bg-linear-to-r from-primary/60 via-primary to-primary/60" />
            <div className="p-5">
              <div className="flex items-center gap-3.5">
                <span className="relative inline-flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <IconLoader className="size-4.5 animate-spin" />
                  <span className="absolute inset-0 animate-pulse rounded-xl bg-primary/5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Signing you out...</p>
                  <p className="text-xs text-muted-foreground">
                    Closing your workspace session safely.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [signout, { isLoading: isSignoutLoading }] = useSignoutMutation();
  const [signoutError, setSignoutError] = useState("");

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

  const dismissSignoutError = () => {
    setSignoutError("");
  };

  const handleSignout = async () => {
    if (isSignoutLoading) {
      return;
    }

    setSignoutError("");

    try {
      await signout().unwrap();
      dispatch(clearCredentials());
      navigate("/signin", { replace: true });
    } catch (error) {
      const { message } = getApiErrorDetails(
        error,
        "Unable to sign out right now. Please try again."
      );
      setSignoutError(message);
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <WorkspaceFrame
        pageMeta={pageMeta}
        onSignout={handleSignout}
        isSignoutLoading={isSignoutLoading}
        signoutError={signoutError}
        onDismissSignoutError={dismissSignoutError}
      />
    </SidebarProvider>
  );
}

export default AppLayout;
