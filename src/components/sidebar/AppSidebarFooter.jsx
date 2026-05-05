import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  cn,
  getUserFullName,
  getUserInitials,
  getUserPrimaryRole,
} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import {
  IconChevronDown,
  IconLoader,
  IconLogout2,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  clearCredentials,
  selectAuthError,
  selectCurrentUser,
  selectIsAuthLoading,
} from "@/features/auth";
import { Skeleton } from "../ui/skeleton";

const AppSidebarFooter = ({
  isCollapsed,
  setSignoutError,
  isMobile,
  setMobileOpen,
  signout,
  isSignoutLoading,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const isProfileLoading = useSelector(selectIsAuthLoading);
  const authError = useSelector(selectAuthError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileInitials = getUserInitials(user);
  const profileName = getUserFullName(user);
  const profileRole = getUserPrimaryRole(user);

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

  if (isProfileLoading) {
    return (
      <Skeleton className="h-14 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
    );
  }

  if (authError) {
    return <div>{authError}</div>;
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton 
                size="lg" 
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground shadow-sm">
                  {profileInitials}
                </div>

                <div className={cn("flex flex-col min-w-0 flex-1", isCollapsed && "lg:hidden")}>
                  <span className="truncate text-xs font-semibold text-sidebar-foreground">
                    {profileName}
                  </span>
                  <span className="truncate text-[10px] text-sidebar-foreground/60">
                    {profileRole}
                  </span>
                </div>

                <IconChevronDown 
                  className={cn(
                    "ml-auto size-4 shrink-0 transition-transform duration-200", 
                    isUserMenuOpen && "rotate-180",
                    isCollapsed && "lg:hidden"
                  )} 
                />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={isCollapsed ? "right" : "top"}
              align={isCollapsed ? "center" : "end"}
              sideOffset={10}
              className="w-56 rounded-xl border-border/50 bg-popover shadow-md"
            >
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground shadow-sm">
                    {profileInitials}
                  </span>
                  <div className="min-w-0 flex flex-col">
                    <span className="truncate font-semibold">{profileName}</span>
                    <span className="truncate text-[10px] text-muted-foreground">
                      {user.emailId}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleOnProfileClick}
                className="cursor-pointer gap-2 rounded-lg text-xs"
              >
                <IconUserCircle className="size-4 text-muted-foreground" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={handleSignout}
                disabled={isSignoutLoading}
                className="cursor-pointer gap-2 rounded-lg text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
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
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
