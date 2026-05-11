import { Link } from "react-router-dom";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import LogoBrand from "../common/LogoBrand";
import { cn } from "@/lib/utils";

const AppSidebarHeader = ({ isCollapsed, onNavigate }) => {
  return (
    <SidebarHeader className={cn(isCollapsed && "items-center")}>
      <SidebarMenu className={cn(isCollapsed && "w-full")}>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            asChild
            tooltip="Dashboard"
            className={cn(isCollapsed && "px-0")}
          >
            <Link
              to="/app/dashboard"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center",
                isCollapsed && "justify-center"
              )}
            >
              <LogoBrand
                size={isCollapsed ? "sm" : "md"}
                subtitle="Project Management"
                showText={!isCollapsed}
                logoClassName="bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                nameClassName="text-sidebar-foreground"
                subClassName="text-sidebar-foreground/60"
              />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
