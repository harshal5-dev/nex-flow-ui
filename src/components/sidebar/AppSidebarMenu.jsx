import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";

const AppSidebarMenu = ({ isCollapsed, onNavigate, navigationItems }) => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(isCollapsed && "lg:sr-only")}>
        Command Menu
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive} 
                  tooltip={item.title}
                  className="h-10 transition-none"
                >
                  <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    className="flex items-center gap-3"
                  >
                    <item.Icon className="size-4 shrink-0" />
                    <span className={cn("truncate", isCollapsed && "lg:hidden")}>
                      {item.title}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default AppSidebarMenu;
