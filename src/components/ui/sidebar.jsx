import { useContext, useEffect, useState } from "react";
import { IconChevronLeft, IconMenu2, IconX } from "@tabler/icons-react";

import { SidebarContext } from "@/components/ui/sidebar-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < 1024;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const media = window.matchMedia("(max-width: 1023px)");
    const onChange = () => setIsMobile(media.matches);

    onChange();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return isMobile;
}

function SidebarProvider({ defaultOpen = true, children }) {
  const isMobile = useIsMobile();
  const [desktopOpen, setDesktopOpen] = useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();

        if (isMobile) {
          setMobileOpen((current) => !current);
        } else {
          setDesktopOpen((current) => !current);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobile]);

  const open = isMobile ? mobileOpen : desktopOpen;
  const setOpen = isMobile ? setMobileOpen : setDesktopOpen;

  const value = {
    isMobile,
    open,
    desktopOpen,
    mobileOpen,
    setOpen,
    setDesktopOpen,
    setMobileOpen,
    toggleSidebar: () => setOpen((current) => !current),
    isCollapsed: !desktopOpen,
  };

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-provider"
        data-collapsed={desktopOpen ? "false" : "true"}
        className="flex min-h-svh w-full"
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("Sidebar components must be used inside SidebarProvider");
  }

  return context;
}

function Sidebar({ className, children }) {
  const { isMobile, mobileOpen, setMobileOpen, desktopOpen } =
    useSidebarContext();

  if (isMobile) {
    return (
      <div
        data-slot="sidebar-mobile"
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Close navigation"
          className={cn(
            "absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-700",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          data-slot="sidebar"
          className={cn(
            "relative h-full w-64 max-w-[86vw] border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-700 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
        >
          <div className="flex h-full flex-col gap-2.5 overflow-hidden p-2.5">
            {children}
          </div>
        </aside>
      </div>
    );
  }

  return (
    <aside
      data-slot="sidebar"
      data-state={desktopOpen ? "expanded" : "collapsed"}
      className={cn(
        "relative hidden h-svh shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-700 ease-out lg:block",
        desktopOpen ? "w-64" : "w-20",
        className
      )}
    >
      <div className="flex h-full flex-col gap-2.5 overflow-hidden p-2.5">
        {children}
      </div>
    </aside>
  );
}

function SidebarTrigger({ className, onClick, ...props }) {
  const { isMobile, mobileOpen, desktopOpen, toggleSidebar } =
    useSidebarContext();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("shrink-0", className)}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      aria-label={
        isMobile
          ? mobileOpen
            ? "Close navigation"
            : "Open navigation"
          : desktopOpen
            ? "Collapse navigation"
            : "Expand navigation"
      }
      {...props}
    >
      {isMobile ? (
        mobileOpen ? (
          <IconX className="size-4" />
        ) : (
          <IconMenu2 className="size-4" />
        )
      ) : (
        <IconChevronLeft
          className={cn(
            "size-4 transition-transform duration-700",
            desktopOpen ? "rotate-0" : "rotate-180"
          )}
        />
      )}
    </Button>
  );
}

function SidebarInset({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("flex min-h-svh min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }) {
  return (
    <header
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto",
        className
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }) {
  return (
    <footer
      data-slot="sidebar-footer"
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }) {
  return (
    <section
      data-slot="sidebar-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({ className, ...props }) {
  return (
    <p
      data-slot="sidebar-group-label"
      className={cn(
        "px-1 text-[11px] font-medium tracking-[0.14em] text-sidebar-foreground/60 uppercase",
        className
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("grid gap-1.5", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("grid gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("list-none", className)}
      {...props}
    />
  );
}

function SidebarMenuButton({ className, asChild = false, isActive = false, ...props }) {
  const { isCollapsed } = useSidebarContext();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive ? "true" : "false"}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium transition-all duration-500 outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 hover:-translate-y-px",
        isActive
          ? "bg-primary/10 text-primary shadow-[0_4px_12px_-4px_rgba(var(--primary-rgb),0.3)] dark:bg-primary/20 dark:text-primary-foreground dark:shadow-none " +
            (!isCollapsed ? "before:absolute before:left-0 before:top-1/2 before:h-2/3 before:w-1 before:-translate-y-1/2 before:rounded-r-md before:bg-primary before:shadow-[0_0_8px_var(--primary)] dark:before:shadow-none before:transition-all before:duration-500" : "")
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isCollapsed && "lg:justify-center lg:px-2",
        className
      )}
      {...props}
    />
  );
}

function SidebarRail({ className, ...props }) {
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
      className={cn(
        "absolute top-1/2 -right-3 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-all duration-300 hover:bg-sidebar-accent lg:flex",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <IconChevronLeft
        className={cn(
          "size-3.5 transition-transform duration-700",
          isCollapsed ? "rotate-180" : "rotate-0"
        )}
      />
    </button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
};
