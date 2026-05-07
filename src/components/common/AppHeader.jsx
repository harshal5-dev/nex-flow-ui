import { IconChevronRight, IconBuildingSkyscraper } from "@tabler/icons-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Badge } from "../ui/badge";
import ThemeToggleButton from "./ThemeToggleButton";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth";
import { getUserOrganization } from "@/lib/utils";

const AppHeader = ({ pageMeta }) => {
  const user = useSelector(selectCurrentUser);
  const organization = getUserOrganization(user);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-sidebar px-3 backdrop-blur transition-[width,height] ease-linear supports-backdrop-filter:bg-sidebar sm:h-16 sm:px-6">
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <SidebarTrigger className="size-9 shrink-0" />

        <Separator
          orientation="vertical"
          className="hidden h-4 bg-border/60 md:block"
        />

        <Breadcrumb className="hidden min-w-0 md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                {pageMeta.title}
              </BreadcrumbPage>
            </BreadcrumbItem>

            {pageMeta.description && (
              <>
                <BreadcrumbSeparator>
                  <IconChevronRight className="size-3.5 text-muted-foreground/70" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-normal text-muted-foreground">
                    {pageMeta.description}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Organization Badge */}
        <Badge
          variant="secondary"
          className="hidden items-center gap-1.5 border border-border/30 bg-secondary/40 px-3 py-1 text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/60 sm:flex"
        >
          <IconBuildingSkyscraper className="size-3.5 text-primary" />
          <span className="max-w-37.5 truncate font-medium">
            {organization}
          </span>
        </Badge>

        <Separator
          orientation="vertical"
          className="hidden h-5 bg-border/40 sm:block"
        />

        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default AppHeader;
