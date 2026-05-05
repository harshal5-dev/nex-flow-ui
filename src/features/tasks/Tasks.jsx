import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IconCalendar,
  IconChecklist,
  IconCircleCheck,
  IconClockHour4,
  IconDotsVertical,
  IconEdit,
  IconLayoutList,
  IconLayoutKanban,
  IconPlus,
  IconSearch,
  IconTrash,
  IconBolt,
  IconArrowRight,
  IconPlayerPlayFilled,
  IconCheck,
  IconLoaderQuarter,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Dummy Data ─────────────────────────────────────────────────────────────

const USERS = [
  { id: "u1", name: "Shraddha Harshal" },
  { id: "u2", name: "Ananya Sharma" },
  { id: "u3", name: "Rahul Patil" },
  { id: "u4", name: "Nina Mehta" },
];

const INITIAL_TASKS = [
  {
    id: "t1",
    title: "Design Homepage Hero Section",
    description: "Create a modern, glassmorphism hero section for the new marketing site.",
    status: "In Progress",
    priority: "High",
    assigneeId: "u1",
    dueDate: "2026-05-10",
  },
  {
    id: "t2",
    title: "Integrate Shadcn UI Components",
    description: "Replace all legacy components with standardized Shadcn UI primitives.",
    status: "Done",
    priority: "High",
    assigneeId: "u2",
    dueDate: "2026-05-02",
  },
  {
    id: "t3",
    title: "Implement User Authentication",
    description: "Set up JWT-based authentication for the dashboard.",
    status: "To Do",
    priority: "Medium",
    assigneeId: "u3",
    dueDate: "2026-05-15",
  },
  {
    id: "t4",
    title: "Optimize Database Queries",
    description: "Review and optimize the slow-performing queries on the team page.",
    status: "In Review",
    priority: "Medium",
    assigneeId: "u4",
    dueDate: "2026-05-08",
  },
  {
    id: "t5",
    title: "Update Brand Assets",
    description: "Export the new logo SVG variants and update the repository.",
    status: "To Do",
    priority: "Low",
    assigneeId: "u1",
    dueDate: "2026-05-20",
  },
  {
    id: "t6",
    title: "Fix Mobile Navigation Bug",
    description: "The hamburger menu does not close when a link is clicked on iOS Safari.",
    status: "In Progress",
    priority: "High",
    assigneeId: "u3",
    dueDate: "2026-05-06",
  },
];

const STATUS_COLUMNS = ["To Do", "In Progress", "In Review", "Done"];

const PRIORITY_STYLES = {
  High: "border-destructive/30 bg-destructive/10 text-destructive",
  Medium: "border-warning/30 bg-warning/10 text-warning",
  Low: "border-success/30 bg-success/10 text-success",
};

const STATUS_ICONS = {
  "To Do": IconCircleCheck,
  "In Progress": IconLoaderQuarter,
  "In Review": IconClockHour4,
  "Done": IconCheck,
};

const STATUS_COLORS = {
  "To Do": "text-muted-foreground",
  "In Progress": "text-info",
  "In Review": "text-primary",
  "Done": "text-success",
};

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarGradient(name) {
  const code = (name?.charCodeAt(0) ?? 0) + (name?.charCodeAt(1) ?? 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UserAvatar({ name, size = "md", className }) {
  const gradient = getAvatarGradient(name);
  const sizeClass = {
    sm: "size-6 text-[9px]",
    md: "size-8 text-xs",
    lg: "size-10 text-sm",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br font-semibold text-white shadow-sm ring-2 ring-background",
        gradient,
        sizeClass,
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}

function TableHeadLabel({ Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/80">
      <Icon className="size-3.5 text-muted-foreground" />
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Tasks() {
  const [activeTab, setActiveTab] = useState("board");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const taskForm = useForm({
    defaultValues: {
      id: "",
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      assigneeId: "none",
      dueDate: "",
    },
  });

  // ── Derived data ─────────────────────────────────────────────────────────

  const usersById = useMemo(
    () => USERS.reduce((acc, u) => ({ ...acc, [u.id]: u }), {}),
    []
  );

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => 
      t.title.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  const tasksByStatus = useMemo(() => {
    const grouped = { "To Do": [], "In Progress": [], "In Review": [], "Done": [] };
    filteredTasks.forEach(t => {
      if (grouped[t.status]) grouped[t.status].push(t);
    });
    return grouped;
  }, [filteredTasks]);

  const statCards = useMemo(() => [
    { label: "Total Tasks", value: tasks.length, Icon: IconChecklist, color: "text-primary", bg: "border-primary/20 bg-primary/10" },
    { label: "To Do", value: tasks.filter(t => t.status === "To Do").length, Icon: IconCircleCheck, color: "text-muted-foreground", bg: "border-border/50 bg-muted/30" },
    { label: "In Progress", value: tasks.filter(t => t.status === "In Progress").length, Icon: IconLoaderQuarter, color: "text-primary", bg: "border-primary/20 bg-primary/10" },
    { label: "Completed", value: tasks.filter(t => t.status === "Done").length, Icon: IconCheck, color: "text-success", bg: "border-success/20 bg-success/10" },
  ], [tasks]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openCreateTaskModal = () => {
    taskForm.reset({
      id: "",
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      assigneeId: "none",
      dueDate: "",
    });
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (values) => {
    const assignee = values.assigneeId === "none" ? "" : values.assigneeId;
    const payload = { ...values, assigneeId: assignee };
    if (values.id) {
      setTasks(cur => cur.map(t => t.id === values.id ? { ...t, ...payload } : t));
    } else {
      setTasks(cur => [{ id: createId("task"), ...payload }, ...cur]);
    }
    setIsTaskModalOpen(false);
  };

  const beginTaskEdit = (task) => {
    taskForm.reset({ ...task, assigneeId: task.assigneeId || "none" });
    setIsTaskModalOpen(true);
  };

  const removeTask = (id) => setTasks(cur => cur.filter(t => t.id !== id));

  const changeTaskStatus = (id, newStatus) => {
    setTasks(cur => cur.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // ── Render Helpers ────────────────────────────────────────────────────────

  const TaskDropdownMenu = ({ task }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => beginTaskEdit(task)}>
          <IconEdit className="mr-2 size-4" />
          Edit Task
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Move To
        </div>
        {STATUS_COLUMNS.filter(s => s !== task.status).map(status => (
          <DropdownMenuItem key={status} onClick={() => changeTaskStatus(task.id, status)}>
            <IconArrowRight className="mr-2 size-4" />
            {status}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => removeTask(task.id)}>
          <IconTrash className="mr-2 size-4" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="flex flex-col min-w-0 w-full gap-6 animate-in fade-in duration-500">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -right-10 size-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <IconChecklist className="size-5 text-primary" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Task Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Plan, track, and manage your team's workflow
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
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

      {/* ── Workspace Area ────────────────────────────────────────────────── */}
      <Tabs defaultValue="board" value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <TabsList className="bg-background/60 shadow-sm border border-border/40">
            <TabsTrigger value="board" className="gap-2">
              <IconLayoutKanban className="size-4" />
              Board
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
                placeholder="Search tasks..."
                className="h-9 w-full sm:w-64 rounded-xl border-border/50 bg-background/60 pl-9 text-sm shadow-sm"
              />
            </div>
            <Button
              type="button"
              className="shrink-0 gap-1.5 rounded-xl"
              onClick={openCreateTaskModal}
            >
              <IconPlus className="size-4" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Kanban Board View */}
        <TabsContent value="board" className="mt-0 w-full min-w-0 outline-none">
          <div className="grid grid-cols-1 gap-4 pb-4 pt-2 md:grid-cols-2 xl:grid-cols-4">
            {STATUS_COLUMNS.map((statusName) => {
              const columnTasks = tasksByStatus[statusName];
              const StatusIcon = STATUS_ICONS[statusName];
              
              return (
                <div key={statusName} className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-muted/20 p-3 shadow-sm backdrop-blur-md transition-all">
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-1 pb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-lg border border-background/50 bg-background/50 shadow-sm backdrop-blur-sm">
                        <StatusIcon className={cn("size-4", STATUS_COLORS[statusName])} />
                      </div>
                      <h3 className="text-sm font-semibold tracking-tight">{statusName}</h3>
                    </div>
                    <Badge variant="secondary" className="h-5 rounded-md border-border/50 bg-background/50 px-1.5 text-[10px] font-bold text-muted-foreground shadow-sm">
                      {columnTasks.length}
                    </Badge>
                  </div>

                  {/* Task List */}
                  <div className="flex flex-col gap-3 min-h-[150px]">
                    {columnTasks.map((task) => (
                      <Card key={task.id} className="group relative overflow-hidden rounded-xl border-border/50 bg-background/80 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                        <CardContent className="p-3.5 sm:p-4">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <Badge variant="outline" className={cn("px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider", PRIORITY_STYLES[task.priority])}>
                              {task.priority}
                            </Badge>
                            <TaskDropdownMenu task={task} />
                          </div>
                          
                          <h4 className="mb-1.5 text-sm font-semibold leading-tight">{task.title}</h4>
                          <p className="mb-4 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">{task.description}</p>
                          
                          <div className="flex items-center justify-between border-t border-border/40 pt-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                              <IconCalendar className="size-3.5" />
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                            </div>
                            {task.assigneeId && usersById[task.assigneeId] ? (
                              <UserAvatar name={usersById[task.assigneeId].name} size="sm" />
                            ) : (
                              <div className="flex size-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/50 bg-muted/30">
                                <IconPlus className="size-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-background/30">
                        <StatusIcon className="size-5 text-muted-foreground/30" />
                        <p className="text-[11px] font-medium text-muted-foreground/50">No tasks here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* List Table View */}
        <TabsContent value="list" className="mt-0 outline-none">
          <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/60 shadow-sm backdrop-blur">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/40">
                    <TableHead className="w-[35%]"><TableHeadLabel Icon={IconChecklist} label="Task" /></TableHead>
                    <TableHead><TableHeadLabel Icon={IconCircleCheck} label="Status" /></TableHead>
                    <TableHead><TableHeadLabel Icon={IconBolt} label="Priority" /></TableHead>
                    <TableHead><TableHeadLabel Icon={IconCalendar} label="Due Date" /></TableHead>
                    <TableHead><TableHeadLabel Icon={IconCheck} label="Assignee" /></TableHead>
                    <TableHead className="w-16 text-right"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        No tasks found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="group/row border-border/40 transition-colors hover:bg-muted/20">
                        <TableCell>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">{task.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            {(() => {
                              const StatusIcon = STATUS_ICONS[task.status];
                              return <StatusIcon className={cn("size-3.5", STATUS_COLORS[task.status])} />;
                            })()}
                            {task.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("px-2 py-0 text-[10px] uppercase tracking-wider", PRIORITY_STYLES[task.priority])}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </TableCell>
                        <TableCell>
                          {task.assigneeId && usersById[task.assigneeId] ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar name={usersById[task.assigneeId].name} size="sm" />
                              <span className="text-sm text-muted-foreground">{usersById[task.assigneeId].name}</span>
                            </div>
                          ) : (
                            <span className="text-xs italic text-muted-foreground/60">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <TaskDropdownMenu task={task} />
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

      {/* ── Task Modal ────────────────────────────────────────────────────── */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{taskForm.getValues().id ? "Edit Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
              {taskForm.getValues().id ? "Update the details of your task." : "Fill out the details below to add a new task to the board."}
            </DialogDescription>
          </DialogHeader>
          <Form {...taskForm}>
            <form onSubmit={taskForm.handleSubmit(handleTaskSubmit)} className="space-y-4 pt-2">
              <FormField
                control={taskForm.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Update user dashboard..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={taskForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Add a more detailed description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={taskForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_COLUMNS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={taskForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={taskForm.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Unassigned</SelectItem>
                          {USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={taskForm.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-border/40 pt-5 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {taskForm.getValues().id ? "Save Changes" : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Tasks;
