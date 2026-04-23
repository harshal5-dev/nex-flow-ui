import { useContext } from "react";

import { SidebarContext } from "@/components/ui/sidebar-context";

function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }

  return context;
}

export { useSidebar };
