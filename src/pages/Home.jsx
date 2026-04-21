import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ThemeToggleButton from "@/components/common/theme-toggle-button";

const portfolioStats = [
  { label: "Tenant-ready Modules", value: "12+" },
  { label: "Task Workflow States", value: "8" },
  { label: "Reusable UI Blocks", value: "30+" },
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
            <Button size="sm" onClick={() => navigate("/register")}>
              Start Experience
            </Button>
          </div>
        </Card>

        <main className="grid gap-6">
          <Card className="grid animate-in gap-6 rounded-3xl bg-card/70 p-6 duration-700 fade-in slide-in-from-bottom-4 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-foreground">
                Featured Portfolio Build
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
                Next Flow: a modern multi-tenant product for managing projects,
                tasks, and team delivery.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
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
                  onClick={() => navigate("/register")}
                >
                  Explore Tenant Flow
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {portfolioStats.map((item) => (
                  <Card
                    key={item.label}
                    className="rounded-xl bg-background/60 p-4"
                  >
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

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
                  UI consistency built on reusable components and semantic theme
                  tokens.
                </p>
                <p>
                  Balanced visual design that presents both technical depth and
                  business value.
                </p>
              </div>
            </Card>
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
