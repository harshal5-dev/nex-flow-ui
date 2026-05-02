import { useSidebar } from "@/hooks/useSidebar";
import { Sidebar, SidebarContent, SidebarRail } from "../ui/sidebar";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarMenu from "./AppSidebarMenu";

const AppSidebar = ({
  onNavigate,
  navigationItems,
  setSignoutError,
  signout,
  isSignoutLoading,
  isMobile,
  setMobileOpen,
}) => {
  const { isCollapsed } = useSidebar();
  return (
    <Sidebar>
      <AppSidebarHeader isCollapsed={isCollapsed} onNavigate={onNavigate} />

      <SidebarContent>
        <AppSidebarMenu
          isCollapsed={isCollapsed}
          navigationItems={navigationItems}
          onNavigate={onNavigate}
        />
      </SidebarContent>

      <AppSidebarFooter
        isCollapsed={isCollapsed}
        setSignoutError={setSignoutError}
        isMobile={isMobile}
        setMobileOpen={setMobileOpen}
        signout={signout}
        isSignoutLoading={isSignoutLoading}
      />

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
