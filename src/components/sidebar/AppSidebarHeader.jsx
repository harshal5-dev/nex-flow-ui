import { Link } from "react-router-dom";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import LogoBrand from "../common/LogoBrand";
import { cn } from "@/lib/utils";

const AppSidebarHeader = ({ isCollapsed, onNavigate }) => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild tooltip="Dashboard">
            <Link
              to="/app/dashboard"
              onClick={onNavigate}
              className={cn("flex items-center", isCollapsed && "justify-center")}
            >
              <LogoBrand
                size="md"
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
