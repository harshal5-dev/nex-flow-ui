import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarFooter } from "../ui/sidebar";
import {
  IconChevronDown,
  IconLoader,
  IconLogout2,
  IconUserCircle,
} from "@tabler/icons-react";
import { clearCredentials } from "@/features/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const profileBrand = {
  name: "Shraddha Dev",
  role: "UI/UX Engineer",
  email: "hello@shraddhadev.com",
};

const AppSidebarFooter = ({
  isCollapsed,
  setSignoutError,
  isMobile,
  setMobileOpen,
  signout,
  isSignoutLoading,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileInitials = profileBrand.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

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
      const { message } = error.data;
      setSignoutError(message);
    }
  };

  const handleOnProfileClick = () => {
    navigate("/app/profile");
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <SidebarFooter>
      <DropdownMenu onOpenChange={setIsUserMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open user menu"
            className={cn(
              "group flex w-full items-center gap-2.5 rounded-xl border border-sidebar-border/60 bg-sidebar/95 p-2.5 text-left transition-all duration-300 hover:border-sidebar-primary/25 hover:bg-sidebar-accent/85",
              isCollapsed && "lg:justify-center lg:px-1.5"
            )}
          >
            <span className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-primary/30 bg-sidebar-primary/12 text-[11px] font-semibold text-sidebar-primary shadow-[0_10px_16px_-14px_var(--color-sidebar-primary)]">
              {profileInitials}
              <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-500" />
            </span>

            <span className={cn("min-w-0 flex-1", isCollapsed && "lg:hidden")}>
              <span className="block truncate text-xs font-semibold text-sidebar-foreground">
                {profileBrand.name}
              </span>
              <span className="block truncate text-[11px] text-sidebar-foreground/55">
                {profileBrand.role}
              </span>
            </span>

            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-md border border-sidebar-border/50 text-sidebar-foreground/55 transition-all duration-300 group-hover:border-sidebar-primary/25 group-hover:text-sidebar-primary",
                isUserMenuOpen && "rotate-180",
                isCollapsed && "lg:hidden"
              )}
            >
              <IconChevronDown className="size-3.5" />
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side={isCollapsed ? "right" : "top"}
          align={isCollapsed ? "center" : "start"}
          sideOffset={10}
          className="w-64 rounded-xl border-border/70 bg-popover/95 p-1.5 shadow-lg backdrop-blur-xl"
        >
          <DropdownMenuLabel className="px-2.5 py-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-[10px] font-semibold text-primary">
                {profileInitials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">
                  {profileBrand.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {profileBrand.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleOnProfileClick}
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] data-highlighted:bg-accent/85 [&_svg]:text-foreground/70"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-md border border-border/70 bg-background/80">
              <IconUserCircle className="size-3.5" />
            </span>
            View profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={handleSignout}
            disabled={isSignoutLoading}
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive [&_svg]:text-destructive data-highlighted:[&_svg]:text-destructive"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-md border border-destructive/25 bg-destructive/10">
              {isSignoutLoading ? (
                <IconLoader className="size-3.5 animate-spin" />
              ) : (
                <IconLogout2 className="size-3.5" />
              )}
            </span>
            {isSignoutLoading ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
