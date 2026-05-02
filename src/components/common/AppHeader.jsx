import { IconArrowBadgeRightFilled, IconBuilding } from "@tabler/icons-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import ThemeToggleButton from "./ThemeToggleButton";

const AppHeader = ({ pageMeta }) => {
  return (
    <header className="shrink-0 border-b border-border/50 bg-linear-to-r from-background via-background to-primary/10 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <div className="flex h-15 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
        {/* Left section */}
        <div className="flex h-full min-w-0 items-center gap-2 sm:gap-3">
          <SidebarTrigger className="size-9 shrink-0 transition-colors" />

          <Separator
            orientation="vertical"
            className="hidden h-5 bg-border/75 md:block"
          />

          <div className="relative min-w-0 flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageMeta.title}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block">
                  <IconArrowBadgeRightFilled />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="hidden md:block">
                    {pageMeta.description}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Right section */}
        <div className="flex h-full items-center gap-2">
          {/* Organization Badge */}
          <div className="hidden min-w-0 items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 sm:flex">
            <IconBuilding className="size-4 shrink-0 text-primary" />
            <span className="truncate text-sm font-medium">{"Team Nest"}</span>
          </div>

          <div className="hidden h-6 w-px bg-border/30 sm:block" />
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
