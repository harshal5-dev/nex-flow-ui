import { IconAlertTriangle, IconArchive, IconEdit, IconTrash } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/features/project/components/details/projectDetail.utils";

const ProjectSettingsTab = ({
  project,
  canEditProject,
  canDeleteProject,
  onEditProject,
  onDeleteProject,
}) => {
  return (
    <div className="space-y-5">
      <Card className="border-border/50 bg-card/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Project Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Project Name</span>
            <span className="font-medium">{project?.name}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline">{project?.status || "-"}</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Due Date</span>
            <span>{formatDate(project?.dueDate)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Project Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {canEditProject ? (
            <Button type="button" variant="outline" onClick={onEditProject}>
              <IconEdit className="size-4" />
              Edit Project
            </Button>
          ) : null}

          <Button type="button" variant="ghost" disabled>
            <IconArchive className="size-4" />
            Archive Project
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <IconAlertTriangle className="size-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            disabled={!canDeleteProject}
            onClick={onDeleteProject}
          >
            <IconTrash className="size-4" />
            Archive/Delete Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettingsTab;
