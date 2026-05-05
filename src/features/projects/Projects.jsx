import { useMemo, useState } from "react";
import {
  IconCalendar,
  IconCheck,
  IconChecklist,
  IconCircleCheck,
  IconDotsVertical,
  IconEdit,
  IconFolders,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
  IconSearch,
  IconTrash,
  IconLoaderQuarter,
  IconArrowUpRight,
  IconUsers
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Mock Data ──────────────────────────────────────────────────────────

const usersById = {
  "user-1": { name: "Harshal Ganbote" },
  "user-2": { name: "Shraddha V" },
  "user-3": { name: "Alice Smith" },
  "user-4": { name: "Bob Johnson" },
};

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ name, className }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-background font-semibold text-[10px]",
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    name: "Portfolio Website Restyle",
    description: "Complete redesign of the main portfolio using modern Shadcn components and semantic Tailwind tokens.",
    status: "In Progress",
    progress: 78,
    dueDate: "2026-06-15",
    team: ["user-1", "user-2"],
  },
  {
    id: "proj-2",
    name: "Client Admin Panel",
    description: "Develop the user management and analytics dashboard for the new enterprise client.",
    status: "In Progress",
    progress: 45,
    dueDate: "2026-07-01",
    team: ["user-2", "user-3", "user-4"],
  },
  {
    id: "proj-3",
    name: "Auth Microservice",
    description: "Migrate the legacy authentication system to a new JWT-based microservice architecture.",
    status: "Review",
    progress: 95,
    dueDate: "2026-05-20",
    team: ["user-1", "user-4"],
  },
  {
    id: "proj-4",
    name: "Marketing Site Q3",
    description: "Prepare the landing pages and SEO optimizations for the Q3 marketing push.",
    status: "Planning",
    progress: 10,
    dueDate: "2026-08-15",
    team: ["user-3"],
  },
  {
    id: "proj-5",
    name: "Database Migration",
    description: "Move all core MongoDB clusters to the new cloud provider region for lower latency.",
    status: "Completed",
    progress: 100,
    dueDate: "2026-04-30",
    team: ["user-1"],
  },
];

const STATUS_COLORS = {
  "Planning": "text-muted-foreground",
  "In Progress": "text-info",
  "Review": "text-warning",
  "Completed": "text-success",
};

const STATUS_BG = {
  "Planning": "border-border/50 bg-muted/30",
  "In Progress": "border-info/20 bg-info/10",
  "Review": "border-warning/20 bg-warning/10",
  "Completed": "border-success/20 bg-success/10",
};

// ─── Components ─────────────────────────────────────────────────────────

const ProjectDropdownMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="size-6 rounded-md hover:bg-muted/50">
        <IconDotsVertical className="size-3.5 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-40 rounded-xl border-border/50 bg-background/95 backdrop-blur-md">
      <DropdownMenuItem className="gap-2 text-xs">
        <IconEdit className="size-3.5" />
        Edit Details
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 text-xs">
        <IconUsers className="size-3.5" />
        Manage Team
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border/50" />
      <DropdownMenuItem className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive">
        <IconTrash className="size-3.5" />
        Archive Project
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const TableHeadLabel = ({ Icon, label }) => (
  <div className="flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
    <Icon className="size-3.5" />
    {label}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────

export default function Projects() {
  const [projects] = useState(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("grid");

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const statCards = useMemo(() => [
    { label: "Total Projects", value: projects.length, Icon: IconFolders, color: "text-primary", bg: "border-primary/20 bg-primary/10" },
    { label: "In Progress", value: projects.filter(p => p.status === "In Progress").length, Icon: IconLoaderQuarter, color: "text-info", bg: "border-info/20 bg-info/10" },
    { label: "In Review", value: projects.filter(p => p.status === "Review").length, Icon: IconCircleCheck, color: "text-warning", bg: "border-warning/20 bg-warning/10" },
    { label: "Completed", value: projects.filter(p => p.status === "Completed").length, Icon: IconCheck, color: "text-success", bg: "border-success/20 bg-success/10" },
  ], [projects]);

  return (
    <main className="flex flex-col min-w-0 w-full gap-6 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -right-10 size-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <IconFolders className="size-5 text-primary" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Project Portfolio
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage, track, and collaborate on your active projects
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Stat Cards ── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card
            key={item.label}
            className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3 p-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums">
                  {item.value}
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
                  item.bg
                )}
              >
                <item.Icon className={cn("size-5", item.color)} />
              </span>
            </div>
          </Card>
        ))}
      </section>

      {/* ── Workspace Area ── */}
      <Tabs defaultValue="grid" value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <TabsList className="bg-background/60 shadow-sm border border-border/40">
            <TabsTrigger value="grid" className="gap-2">
              <IconLayoutGrid className="size-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <IconLayoutList className="size-4" />
              List
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="h-9 w-full sm:w-64 rounded-xl border-border/50 bg-background/60 pl-9 text-sm shadow-sm"
              />
            </div>
            <Button
              type="button"
              className="shrink-0 gap-1.5 rounded-xl"
            >
              <IconPlus className="size-4" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Grid View */}
        <TabsContent value="grid" className="mt-0 w-full min-w-0 outline-none">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group relative flex flex-col overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <CardContent className="flex flex-1 flex-col p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <Badge variant="outline" className={cn("px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", STATUS_BG[project.status], STATUS_COLORS[project.status])}>
                      {project.status}
                    </Badge>
                    <ProjectDropdownMenu />
                  </div>

                  <h3 className="mb-1.5 text-base font-semibold tracking-tight">{project.name}</h3>
                  <p className="mb-4 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">{project.description}</p>

                  <div className="mt-auto">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                        <div 
                          className="h-full rounded-full bg-linear-to-r from-info to-primary transition-all duration-1000 ease-out" 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <IconCalendar className="size-3.5" />
                        {new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      
                      <div className="flex -space-x-1.5">
                        {project.team.map((userId, i) => (
                          <UserAvatar 
                            key={userId} 
                            name={usersById[userId]?.name} 
                            className={cn("size-6", i > 0 && "-ml-2")} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/30">
              <IconFolders className="size-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">No projects found</p>
            </div>
          )}
        </TabsContent>

        {/* List Table View */}
        <TabsContent value="list" className="mt-0 outline-none">
          <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/40">
                    <TableHead className="w-[30%]"><TableHeadLabel Icon={IconFolders} label="Project Name" /></TableHead>
                    <TableHead><TableHeadLabel Icon={IconCircleCheck} label="Status" /></TableHead>
                    <TableHead className="w-1/4"><TableHeadLabel Icon={IconArrowUpRight} label="Progress" /></TableHead>
                    <TableHead><TableHeadLabel Icon={IconCalendar} label="Due Date" /></TableHead>
                    <TableHead><TableHeadLabel Icon={IconUsers} label="Team" /></TableHead>
                    <TableHead className="w-16 text-right"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                        No projects found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id} className="group border-border/40 hover:bg-muted/20">
                        <TableCell>
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="mt-0.5 truncate text-[11px] text-muted-foreground max-w-[200px]">
                            {project.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("px-2 py-0 text-[10px]", STATUS_BG[project.status], STATUS_COLORS[project.status])}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-full flex-1 overflow-hidden rounded-full bg-muted/50">
                              <div 
                                className="h-full rounded-full bg-linear-to-r from-info to-primary" 
                                style={{ width: `${project.progress}%` }} 
                              />
                            </div>
                            <span className="w-8 text-right text-[10px] font-medium text-muted-foreground">
                              {project.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-1.5">
                            {project.team.slice(0, 3).map((userId) => (
                              <UserAvatar key={userId} name={usersById[userId]?.name} className="size-6" />
                            ))}
                            {project.team.length > 3 && (
                              <div className="flex size-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-medium">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <ProjectDropdownMenu />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
