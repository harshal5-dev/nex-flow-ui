import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  IconBuildingSkyscraper,
  IconChevronDown,
  IconChecklist,
  IconLayoutDashboard,
  IconLoader,
  IconLogout2,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";

import ThemeToggleButton from "@/components/common/theme-toggle-button";
import { Card } from "@/components/ui/card";
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
import { authApi, useSignoutMutation } from "@/modules/auth/authApi";
import { clearCredentials } from "@/modules/auth/authSlice";

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
          <SidebarGroupContent className="rounded-xl border border-sidebar-border/60 bg-sidebar/35 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
            <SidebarMenu className="gap-1.5">
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
                          "group/nav relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-2 py-2 text-[13px] font-medium transition-all duration-700 ease-out",
                          isActive
                            ? "border-sidebar-primary/30 bg-linear-to-r from-sidebar-primary/18 via-sidebar-primary/10 to-sidebar-accent/55 text-sidebar-primary shadow-[0_16px_34px_-24px_var(--color-sidebar-primary)]"
                            : "border-transparent bg-transparent text-sidebar-foreground/80 hover:border-sidebar-border/75 hover:bg-sidebar-accent/85 hover:text-sidebar-accent-foreground",
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
                                "pointer-events-none absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-sidebar-primary",
                                isCollapsed && "lg:hidden"
                              )}
                            />
                          ) : null}

                          <span
                            className={cn(
                              "relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-700",
                              isActive
                                ? "border-sidebar-primary/35 bg-sidebar-primary/16 text-sidebar-primary shadow-[0_8px_24px_-18px_var(--color-sidebar-primary)]"
                                : "border-sidebar-border/70 bg-sidebar text-sidebar-foreground/70 group-hover/nav:border-sidebar-border group-hover/nav:bg-sidebar-accent"
                            )}
                          >
                            <item.Icon
                              className={cn(
                                "size-3.5 transition-transform duration-500",
                                isActive
                                  ? "scale-110"
                                  : "group-hover/nav:scale-110"
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
                                  ? "text-sidebar-primary/75"
                                  : "text-sidebar-foreground/60"
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
      </SidebarContent>

      <SidebarFooter className="pt-1.5">
        <DropdownMenu onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open user menu"
              className={cn(
                "group relative flex w-full items-center gap-2 rounded-xl border border-sidebar-border/80 bg-sidebar-accent/45 p-2 text-left text-sidebar-foreground shadow-none transition-all duration-700 hover:-translate-y-0.5 hover:border-sidebar-primary/30 hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 focus-visible:outline-none",
                isCollapsed && "lg:justify-center lg:px-1.5"
              )}
            >
              <span className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-primary/30 bg-sidebar-primary/14 text-[11px] font-semibold text-sidebar-primary">
                WA
                <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-sidebar bg-emerald-500" />
              </span>

              <div className={cn("min-w-0 flex-1", isCollapsed && "lg:hidden")}>
                <p className="truncate text-xs font-semibold tracking-tight">
                  Workspace Admin
                </p>
                <p className="truncate text-[11px] text-sidebar-foreground/65">
                  Product Owner
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-md border border-sidebar-border/60 text-sidebar-foreground/70 transition-colors group-hover:border-sidebar-primary/30 group-hover:text-sidebar-primary",
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
            className="w-60 border-sidebar-border/80 bg-sidebar/95 text-sidebar-foreground backdrop-blur-xl"
          >
            <DropdownMenuLabel className="px-2 pt-1.5 pb-2">
              <p className="text-xs font-semibold tracking-tight">
                Workspace Admin
              </p>
              <p className="text-[11px] font-normal text-sidebar-foreground/65">
                admin@nexflow.local
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-sidebar-border/80" />

            <DropdownMenuItem
              onSelect={onOpenProfile}
              className="gap-2 rounded-lg text-sidebar-foreground/90 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground"
            >
              <IconUserCircle className="size-4 text-sidebar-primary" />
              View profile
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-sidebar-border/80" />

            <DropdownMenuItem
              onSelect={onSignout}
              disabled={isSignoutLoading}
              className="gap-2 rounded-lg text-destructive focus:bg-destructive/15 focus:text-destructive"
            >
              {isSignoutLoading ? (
                <IconLoader className="size-4 animate-spin" />
              ) : (
                <IconLogout2 className="size-4" />
              )}
              {isSignoutLoading ? "Signing out..." : "Sign out"}
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
            {signoutError ? (
              <StatusCallout
                variant="error"
                title="Sign out failed"
                message={signoutError}
                onDismiss={onDismissSignoutError}
                className="mb-3"
              />
            ) : null}

            <Card className="min-h-full border-border/70 bg-card/65 p-3 shadow-sm md:p-5">
              <div className="min-h-full animate-in duration-700 fade-in slide-in-from-bottom-2">
                <Outlet />
              </div>
            </Card>
          </main>
        </SidebarInset>
      </div>

      {isSignoutLoading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm rounded-xl border-border/70 bg-card/95 p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                <IconLoader className="size-4 animate-spin" />
              </span>
              <div>
                <p className="text-sm font-semibold">Signing you out...</p>
                <p className="text-xs text-muted-foreground">
                  Closing your active workspace session safely.
                </p>
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
      dispatch(authApi.util.resetApiState());
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
