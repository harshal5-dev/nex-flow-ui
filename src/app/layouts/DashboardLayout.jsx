import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  IconChecklist,
  IconFolders,
  IconLayoutDashboard,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useSignoutMutation } from "@/features/auth/api/authApi";
import SidebarFrame from "@/components/sidebar/SidebarFrame";
import { useSelector } from "react-redux";
import { selectAuthPermissions } from "@/features/auth";
import { hasAnyPermission } from "@/lib/utils";
import { PERMISSIONS } from "@/constant/global";

const navigationItems = [
  {
    title: "Dashboard",
    caption: "Overview",
    path: "/app/dashboard",
    Icon: IconLayoutDashboard,
  },
  {
    title: "Projects",
    caption: "Roadmaps",
    path: "/app/projects",
    Icon: IconFolders,
  },
  {
    title: "Tasks",
    caption: "Execution",
    path: "/app/tasks",
    Icon: IconChecklist,
  },
  {
    title: "Team",
    caption: "People",
    path: "/app/team",
    Icon: IconUsers,
  },
  {
    title: "Profile",
    caption: "Settings",
    path: "/app/profile",
    Icon: IconUserCircle,
  },
];

const DashboardLayout = () => {
  const location = useLocation();
  const [signout, { isLoading: isSignoutLoading }] = useSignoutMutation();
  const [signoutError, setSignoutError] = useState("");
  const permissions = useSelector(selectAuthPermissions);

  const filteredNavigationItems = useMemo(() => {
    return navigationItems.filter((item) => {
      switch (item.title) {
        case "Team":
          return hasAnyPermission(permissions, [
            PERMISSIONS.MANAGE_USERS,
            PERMISSIONS.VIEW_LIST_USERS,
            PERMISSIONS.VIEW_LIST_ROLES,
            PERMISSIONS.MANAGE_ROLES,
          ]);
        default:
          return true;
      }
    });
  }, [permissions]);

  const pageMeta = useMemo(() => {
    const activePage = navigationItems.find((item) =>
      location.pathname.startsWith(item.path)
    );

    if (activePage) {
      return {
        title: activePage.title,
        description: activePage.caption,
      };
    }

    return {
      title: "Workspace",
      description: "Operations",
    };
  }, [location.pathname]);

  const dismissSignoutError = () => {
    setSignoutError("");
  };

  return (
    <SidebarProvider defaultOpen>
      <SidebarFrame
        pageMeta={pageMeta}
        setSignoutError={setSignoutError}
        isSignoutLoading={isSignoutLoading}
        signoutError={signoutError}
        onDismissSignoutError={dismissSignoutError}
        signout={signout}
        navigationItems={filteredNavigationItems}
      />
    </SidebarProvider>
  );
};

export default DashboardLayout;
