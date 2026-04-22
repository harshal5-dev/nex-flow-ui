import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ThemeToggleButton from "@/components/common/theme-toggle-button";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCode,
  IconServer,
  IconWorldWww,
} from "@tabler/icons-react";

const portfolioStats = [
  {
    label: "Tenant-ready Modules",
    value: "12+",
    note: "Configurable workspaces with isolated access controls.",
  },
  {
    label: "Task Workflow States",
    value: "8",
    note: "Clear transitions from backlog planning to final delivery.",
  },
  {
    label: "Reusable UI Blocks",
    value: "30+",
    note: "Reusable shadcn-based components for faster product rollout.",
  },
];

const featureCards = [
  {
    title: "Multi-tenant Workspace",
    description:
      "Isolated project spaces, role-aware access, and configuration per organization.",
  },
  {
    title: "Project Planning Hub",
    description:
      "Roadmaps, milestones, and initiative-level tracking in one operational dashboard.",
  },
  {
    title: "Task Intelligence",
    description:
      "Priorities, ownership, due dates, and status flows designed for high-velocity teams.",
  },
];

const journeySteps = [
  {
    title: "01. Tenant Onboarding",
    description:
      "Create a workspace, configure branding, and invite members with scoped permissions.",
  },
  {
    title: "02. Project Execution",
    description:
      "Break goals into milestones and tasks with clear ownership, urgency, and deadlines.",
  },
  {
    title: "03. Delivery Visibility",
    description:
      "Track progress in real time and share updates through a polished portfolio-grade UI.",
  },
];

const githubRepositories = [
  {
    title: "UI Repository",
    description:
      "React frontend for the multi-tenant project and task management experience.",
    stack: "React + Vite",
    href: "https://github.com/harshal5-dev/nex-flow-ui",
    Icon: IconCode,
  },
  {
    title: "API Repository",
    description:
      "Node.js backend for tenant management, projects, tasks, and workflow APIs.",
    stack: "Node.js + REST API",
    href: "https://github.com/harshal5-dev/Nexflow",
    Icon: IconServer,
  },
];

const profileLinks = [
  {
    title: "LinkedIn Profile",
    description:
      "Connect for collaboration, freelance work, and opportunities.",
    href: "https://www.linkedin.com/in/harshal-ganbote",
    Icon: IconBrandLinkedin,
  },
  {
    title: "Portfolio Website",
    description: "Explore more projects, case studies, and ways to contact me.",
    href: "https://harshalganbote.com/",
    Icon: IconWorldWww,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(109,40,217,0.2),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(196,181,253,0.2),transparent_36%),radial-gradient(circle_at_70%_90%,rgba(91,33,182,0.18),transparent_34%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 md:py-10">
        <Card className="flex animate-in flex-wrap items-center justify-between gap-4 bg-card/80 px-4 py-3 backdrop-blur duration-700 fade-in slide-in-from-top-3">
          <div className="flex items-center gap-3">
            <img
              src="/branding/next-flow-mark.svg"
              alt="Next Flow logo"
              className="size-9 rounded-md"
            />
            <div>
              <p className="text-sm font-semibold">Next Flow</p>
              <p className="text-xs text-muted-foreground">
                Portfolio Project • Project & Task Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Button size="sm" onClick={() => navigate("/signup")}>
              Start Experience
            </Button>
          </div>
        </Card>

        <main className="grid gap-6">
          <Card className="grid animate-in gap-6 rounded-3xl bg-card/70 p-6 duration-700 fade-in slide-in-from-bottom-4 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-foreground">
                Primary
              </p>
              <h1 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight md:text-4xl">
                Next Flow: a modern multi-tenant product for managing projects,
                tasks, and team delivery.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                This UI demonstrates your product vision with a clean, scalable
                design system powered by shadcn styling conventions, expressive
                spacing, and production-ready information architecture.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => navigate("/login")}>
                  Login Workspace
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/signup")}
                >
                  Explore Tenant Flow
                </Button>
              </div>

              <Card className="mt-6 rounded-2xl border-primary/25 bg-background/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-foreground/90">
                  <IconBrandGithub className="size-4 text-primary" />
                  GitHub Project Links
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {githubRepositories.map((repo) => (
                    <a
                      key={repo.title}
                      href={repo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-background/95 via-background/80 to-primary/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-primary/20 via-primary/80 to-primary/20" />

                      <div className="relative flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold">
                          <repo.Icon className="size-4 text-primary" />
                          {repo.title}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary dark:text-foreground">
                          View
                          <IconArrowUpRight className="size-3.5" />
                        </span>
                      </div>

                      <p className="relative mt-2 text-[13px] leading-relaxed text-muted-foreground">
                        {repo.description}
                      </p>

                      <div className="relative mt-3 flex items-center justify-between">
                        <p className="inline-flex rounded-full border border-border/80 bg-background/70 px-2 py-1 text-[11px] font-medium text-foreground/80">
                          {repo.stack}
                        </p>
                        <IconBrandGithub className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {profileLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-xl border border-primary/15 bg-card/60 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card/80"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold">
                          <link.Icon className="size-4 text-primary" />
                          {link.title}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary dark:text-foreground">
                          Visit
                          <IconArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {link.description}
                      </p>
                    </a>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-4">
              <Card className="rounded-2xl bg-background/70 p-5">
                <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">
                  Why This Portfolio Stands Out
                </p>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>
                    Product-focused storytelling with a clear multi-tenant
                    architecture narrative.
                  </p>
                  <p>
                    UI consistency built on reusable components and semantic
                    theme tokens.
                  </p>
                  <p>
                    Balanced visual design that presents both technical depth
                    and business value.
                  </p>
                </div>
              </Card>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {portfolioStats.map((item, index) => (
                  <Card
                    key={item.label}
                    className="group relative overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-background/90 via-background/75 to-primary/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-primary/20 via-primary/80 to-primary/20" />
                    <div className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />

                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-semibold tracking-tight">
                          {item.value}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {item.label}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {item.note}
                        </p>
                      </div>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary dark:text-foreground">
                        0{index + 1}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          <section className="grid animate-in gap-4 delay-150 duration-700 fade-in slide-in-from-bottom-3 md:grid-cols-3">
            {featureCards.map((feature) => (
              <Card key={feature.title} className="rounded-2xl bg-card/70 p-5">
                <h2 className="text-base font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </section>

          <Card className="animate-in rounded-3xl bg-card/70 p-6 delay-300 duration-700 fade-in slide-in-from-bottom-3 md:p-8">
            <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">
              Workflow Journey
            </p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Designed for teams that move from planning to delivery without
              losing context.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {journeySteps.map((step) => (
                <Card
                  key={step.title}
                  className="rounded-2xl bg-background/60 p-4"
                >
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Home;
