import { Link } from "react-router-dom";
import { SidebarHeader } from "../ui/sidebar";
import LogoBrand from "../common/LogoBrand";
import { cn } from "@/lib/utils";

const AppSidebarHeader = ({ isCollapsed, onNavigate }) => {
  return (
    <SidebarHeader>
      <Link
        to="/app/dashboard"
        onClick={onNavigate}
        className={cn(
          "group relative flex min-w-0 items-center px-1.5 py-2 transition-all duration-300",
          "before:absolute before:inset-x-1 before:-bottom-1 before:h-px before:bg-linear-to-r before:from-transparent before:via-sidebar-primary/45 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
          isCollapsed && "lg:justify-center lg:px-0 lg:before:hidden"
        )}
      >
        {!isCollapsed && (
          <span
            aria-hidden
            className="absolute top-2 bottom-2 -left-0.5 w-0.5 rounded-full bg-linear-to-b from-sidebar-primary/10 via-sidebar-primary/80 to-sidebar-primary/10"
          />
        )}

        <LogoBrand
          size="md"
          subtitle="Project Management"
          showText={!isCollapsed}
          logoClassName="border-sidebar-primary/20 bg-linear-to-br from-sidebar-accent to-sidebar shadow-[0_10px_24px_-16px_var(--color-sidebar-primary)]"
          nameClassName="text-sidebar-foreground"
          subClassName="text-sidebar-foreground/60"
        />
      </Link>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
