import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectActionsMenu = ({
  project,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const hasActions = canEdit || canDelete;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Project Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {canEdit ? (
          <DropdownMenuItem onClick={() => onEdit(project)}>
            <IconEdit className="size-4" />
            Edit Project
          </DropdownMenuItem>
        ) : null}

        {canDelete ? (
          <DropdownMenuItem
            onClick={() => onDelete(project)}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <IconTrash className="size-4" />
            Delete Project
          </DropdownMenuItem>
        ) : null}

        {!hasActions ? (
          <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectActionsMenu;
