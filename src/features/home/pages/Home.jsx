import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ThemeToggleButton from "@/components/common/theme-toggle-button";
import AppLayout from "@/app/layouts/AppLayout";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCheck,
  IconChevronRight,
  IconCode,
  IconLayoutDashboard,
  IconRocket,
  IconServer,
  IconSparkles,
  IconStack2,
  IconUsers,
  IconWorldWww,
} from "@tabler/icons-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "12+", label: "Modules", accent: true },
  { value: "8", label: "Workflow States", accent: false },
  { value: "30+", label: "UI Blocks", accent: true },
];

const features = [
  {
    Icon: IconStack2,
    title: "Multi-tenant Workspace",
    description:
      "Isolated project spaces with role-aware access and configuration per organization.",
    tag: "Architecture",
  },
  {
    Icon: IconLayoutDashboard,
    title: "Project Planning Hub",
    description:
      "Roadmaps, milestones, and initiative-level tracking in one operational dashboard.",
    tag: "Planning",
  },
  {
    Icon: IconSparkles,
    title: "Task Intelligence",
    description:
      "Priorities, ownership, due dates, and status flows designed for high-velocity teams.",
    tag: "Execution",
  },
];

const journey = [
  {
    step: "01",
    title: "Tenant Onboarding",
    description:
      "Create a workspace, configure branding, and invite members with scoped permissions.",
  },
  {
    step: "02",
    title: "Project Execution",
    description:
      "Break goals into milestones and tasks with clear ownership, urgency, and deadlines.",
  },
  {
    step: "03",
    title: "Delivery Visibility",
    description:
      "Track progress in real time and share updates through a polished portfolio-grade UI.",
  },
];

const techStack = [
  "React 19",
  "Vite 7",
  "Tailwind CSS 4",
  "shadcn/ui",
  "Redux Toolkit",
  "React Router",
];

const repositories = [
  {
    title: "Frontend",
    description: "React UI for multi-tenant project & task management.",
    stack: "React + Vite",
    href: "https://github.com/harshal5-dev/nex-flow-ui",
    Icon: IconCode,
  },
  {
    title: "Backend API",
    description: "Node.js backend for tenant management & workflow APIs.",
    stack: "Node.js + REST",
    href: "https://github.com/harshal5-dev/Nexflow",
    Icon: IconServer,
  },
];

const socials = [
  {
    title: "LinkedIn",
    description: "Connect for collaboration & opportunities.",
    href: "https://www.linkedin.com/in/harshal-ganbote",
    Icon: IconBrandLinkedin,
  },
  {
    title: "Portfolio",
    description: "Explore more projects & case studies.",
    href: "https://harshalganbote.com/",
    Icon: IconWorldWww,
  },
];

const highlights = [
  "Product-focused storytelling with multi-tenant architecture",
  "Reusable component library on semantic theme tokens",
  "Production-ready information architecture",
  "Balanced visual design with technical depth",
];

/* ------------------------------------------------------------------ */
/*  ANIMATED COUNTER                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target, 10) || 0;

  useEffect(() => {
    if (numericTarget === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(numericTarget / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, numericTarget);
      setCount(current);
      if (current >= numericTarget) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [numericTarget]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const Home = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 md:py-10">
        {/* ── NAVBAR ── */}
        <nav className="animate-in duration-700 fade-in slide-in-from-top-3">
          <Card className="flex items-center justify-between gap-4 rounded-2xl border-border/50 bg-card/60 px-4 py-2.5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-sm" />
                <img
                  src="/branding/next-flow-mark.svg"
                  alt="Next Flow logo"
                  className="relative size-9 rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  Next Flow
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Project & Task Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              <Button
                size="sm"
                className="gap-1.5 rounded-lg"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </Card>
        </nav>

        {/* ── HERO ── */}
        <section className="animate-in duration-700 fade-in slide-in-from-bottom-4">
          <Card className="relative overflow-hidden rounded-3xl border-border/50 bg-card/60 p-0 shadow-lg backdrop-blur-xl">
            {/* Decorative gradient mesh */}
            <div className="pointer-events-none absolute -top-32 -right-32 size-80 rounded-full bg-primary/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-primary/6 blur-3xl" />

            <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[1.3fr_0.7fr]">
              {/* Left content */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-semibold tracking-wider text-primary uppercase dark:text-primary-foreground"
                  >
                    <IconRocket className="size-3" />
                    Portfolio Project
                  </Badge>
                </div>

                <h1 className="mt-5 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
                  Modern multi-tenant platform for{" "}
                  <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    project delivery
                  </span>
                </h1>

                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  A clean, scalable design system powered by shadcn styling
                  conventions with expressive spacing and production-ready
                  architecture.
                </p>

                {/* Stats inline */}
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  {stats.map((stat, i) => (
                    <div key={stat.label} className="flex items-center gap-5">
                      <div className="text-center">
                        <p className="text-2xl font-bold tracking-tight text-foreground">
                          <AnimatedCounter
                            target={stat.value.replace("+", "")}
                            suffix={stat.value.includes("+") ? "+" : ""}
                          />
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                      {i < stats.length - 1 && (
                        <Separator
                          orientation="vertical"
                          className="h-8 bg-border/60"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="gap-2 rounded-xl px-6 shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/30"
                    onClick={() => navigate("/signin")}
                  >
                    Login to Workspace
                    <IconArrowRight className="size-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 rounded-xl px-6"
                    onClick={() => navigate("/signup")}
                  >
                    Explore Tenant Flow
                    <IconChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Right panel - Why this stands out */}
              <div className="flex flex-col gap-4">
                <Card className="rounded-2xl border-border/50 bg-background/50 p-5 backdrop-blur">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                    Why This Stands Out
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {highlights.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <div className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                          <IconCheck className="size-2.5 text-primary" />
                        </div>
                        <p className="text-[13px] leading-relaxed text-muted-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Tech stack pills */}
                <Card className="rounded-2xl border-border/50 bg-background/50 p-5 backdrop-blur">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                    Tech Stack
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        {/* ── FEATURES ── */}
        <section className="grid animate-in gap-4 delay-100 duration-700 fade-in slide-in-from-bottom-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                    <feature.Icon className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border/60 text-[10px] font-medium text-muted-foreground"
                  >
                    {feature.tag}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-base font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-[13px] leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ── WORKFLOW JOURNEY ── */}
        <section className="animate-in delay-200 duration-700 fade-in slide-in-from-bottom-3">
          <Card className="relative overflow-hidden rounded-3xl border-border/50 bg-card/60 p-6 shadow-sm backdrop-blur-xl md:p-10">
            <div className="pointer-events-none absolute -top-20 right-10 size-48 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative">
              <Badge
                variant="outline"
                className="gap-1 border-primary/30 bg-primary/8 text-[11px] font-semibold tracking-wider text-primary uppercase dark:text-primary-foreground"
              >
                <IconRocket className="size-3" />
                Workflow
              </Badge>

              <h2 className="mt-4 max-w-lg text-2xl font-bold tracking-tight md:text-3xl">
                From planning to delivery,{" "}
                <span className="text-muted-foreground">
                  without losing context
                </span>
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {journey.map((step, index) => (
                  <Card
                    key={step.title}
                    className="group relative overflow-hidden rounded-2xl border-border/50 bg-background/50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                  >
                    {/* Step connector line (desktop) */}
                    {index < journey.length - 1 && (
                      <div className="pointer-events-none absolute top-8 -right-2 hidden h-px w-4 bg-border/60 md:block" />
                    )}

                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-xs font-bold text-primary transition-colors group-hover:bg-primary/20 dark:text-primary-foreground">
                        {step.step}
                      </span>
                      <p className="text-sm font-semibold">{step.title}</p>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* ── GITHUB & SOCIALS ── */}
        <section className="animate-in delay-300 duration-700 fade-in slide-in-from-bottom-3">
          <Card className="relative overflow-hidden rounded-3xl border-border/50 bg-card/60 p-6 shadow-sm backdrop-blur-xl md:p-10">
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr]">
              {/* Repos */}
              <div>
                <div className="flex items-center gap-2">
                  <IconBrandGithub className="size-4 text-primary" />
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                    Source Code
                  </p>
                </div>

                <div className="mt-4 grid gap-3">
                  {repositories.map((repo) => (
                    <a
                      key={repo.title}
                      href={repo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-colors group-hover:bg-primary/15">
                        <repo.Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{repo.title}</p>
                          <IconArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {repo.description}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-2 border-border/60 text-[10px] font-medium text-muted-foreground"
                        >
                          {repo.stack}
                        </Badge>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div>
                <div className="flex items-center gap-2">
                  <IconUsers className="size-4 text-primary" />
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                    Connect
                  </p>
                </div>

                <div className="mt-4 grid gap-3">
                  {socials.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-colors group-hover:bg-primary/15">
                        <link.Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{link.title}</p>
                          <IconArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Quick CTA */}
                <Card className="mt-4 rounded-2xl border-primary/20 bg-linear-to-br from-primary/8 via-primary/5 to-transparent p-5">
                  <p className="text-sm font-semibold">Ready to explore?</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Sign up to experience the multi-tenant workflow firsthand.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 gap-1.5 rounded-lg"
                    onClick={() => navigate("/signup")}
                  >
                    Create Account
                    <IconArrowRight className="size-3.5" />
                  </Button>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        {/* ── FOOTER ── */}
        <footer className="animate-in pb-4 delay-500 duration-700 fade-in">
          <Separator className="mb-4 bg-border/40" />
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Next Flow — Built by{" "}
              <a
                href="https://harshalganbote.com/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground/80 underline-offset-4 hover:underline"
              >
                Harshal Ganbote
              </a>
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/harshal5-dev/nex-flow-ui"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <IconBrandGithub className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/harshal-ganbote"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <IconBrandLinkedin className="size-4" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
};

export default Home;
