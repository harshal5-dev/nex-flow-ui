import { useSidebar } from "@/hooks/useSidebar";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { SidebarInset } from "../ui/sidebar";
import AppHeader from "../common/AppHeader";
import StatusCallout from "../common/StatusCallout";
import { Card } from "../ui/card";
import { IconLoader } from "@tabler/icons-react";

const SidebarFrame = ({
  pageMeta,
  setSignoutError,
  signout,
  isSignoutLoading,
  signoutError,
  onDismissSignoutError,
  navigationItems,
}) => {
  const location = useLocation();
  const { isMobile, setMobileOpen } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile, location.pathname, setMobileOpen]);

  return (
    <div className="relative flex min-h-svh w-full flex-1 overflow-hidden bg-background text-foreground">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_40%_-10%,rgba(59,130,246,0.08),transparent)]" />

      <div className="relative flex min-h-svh w-full">
        <AppSidebar
          onNavigate={() => {
            if (isMobile) {
              setMobileOpen(false);
            }
          }}
          setSignoutError={setSignoutError}
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          signout={signout}
          isSignoutLoading={isSignoutLoading}
          navigationItems={navigationItems}
        />

        <SidebarInset className="w-full">
          <AppHeader pageMeta={pageMeta} />

          <main className="min-w-0 flex-1 px-3 pt-4 pb-5 md:px-5 md:pb-6">
            {signoutError ? (
              <StatusCallout
                variant="error"
                title="Sign out failed"
                message={signoutError}
                onDismiss={onDismissSignoutError}
                className="mb-4"
              />
            ) : null}

            <div className="animate-in duration-500 fade-in slide-in-from-bottom-2">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>

      {isSignoutLoading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm overflow-hidden rounded-2xl border-border/70 bg-card/95 p-0 shadow-2xl">
            <div className="h-1 bg-linear-to-r from-blue-500 via-emerald-500 to-amber-500" />
            <div className="p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <IconLoader className="size-4.5 animate-spin" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Signing you out...</p>
                  <p className="text-xs text-muted-foreground">
                    Saving your session status and closing workspace access.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default SidebarFrame;
