import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  IconArrowRight,
  IconCheck,
  IconChecklist,
  IconChevronRight,
  IconLayoutDashboard,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import React from "react";
import AnimatedCounter from "./AnimatedCounter";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "3", label: "Core Modules" },
  { value: "5", label: "Task States" },
  { value: "10+", label: "UI Screens" },
];

const techStack = [
  "React 19",
  "Vite 7",
  "Tailwind CSS 4",
  "shadcn/ui",
  "Redux Toolkit",
  "Node.js",
  "MongoDB",
];

const highlights = [
  "Role-based access — Admin, Manager & Developer roles",
  "Full-stack: React frontend + Node.js REST API + MongoDB",
  "Real-time project & task status management",
  "Polished shadcn/ui design with dark mode support",
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="animate-in duration-700 fade-in slide-in-from-bottom-3">
      <Card className="border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Left: Main content */}
          <div className="flex flex-col">
            {/* Badge */}
            <Badge
              variant="outline"
              className="w-fit gap-1.5 border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-semibold tracking-wider text-primary uppercase"
            >
              Full-stack Portfolio Project
            </Badge>

            {/* Headline */}
            <h1 className="mt-5 max-w-xl text-4xl font-bold tracking-tight md:text-5xl md:leading-[1.1]">
              Manage teams, projects{" "}
              <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                & tasks
              </span>{" "}
              — all in one place
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              A full-stack portfolio app featuring role-based team management,
              project planning, and task tracking — built with React, Node.js,
              and MongoDB.
            </p>

            {/* Feature pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <IconUsers className="size-3.5 text-violet-500" />
                Team Management
              </Badge>
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <IconLayoutDashboard className="size-3.5 text-blue-500" />
                Project Tracking
              </Badge>
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <IconChecklist className="size-3.5 text-emerald-500" />
                Task Workflows
              </Badge>
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <IconShieldCheck className="size-3.5 text-amber-500" />
                Role-based Access
              </Badge>
            </div>

            {/* Stats */}
            <div className="mt-7 flex flex-wrap items-center gap-5">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-5">
                  <div className="text-center">
                    <p className="text-2xl font-bold tracking-tight">
                      <AnimatedCounter
                        target={stat.value.replace("+", "")}
                        suffix={stat.value.includes("+") ? "+" : ""}
                      />
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  {i < stats.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-8 bg-border/50"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="gap-2 rounded-lg px-6"
                onClick={() => navigate("/signin")}
              >
                Sign In
                <IconArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-lg border-border/70 px-6 hover:border-primary/40"
                onClick={() => navigate("/signup")}
              >
                Create Account
                <IconChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Right: Side cards */}
          <div className="flex flex-col gap-4">
            {/* Why this stands out */}
            <Card className="border-border/50 bg-background/60 p-5 shadow-sm">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                What&apos;s Inside
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/12">
                      <IconCheck className="size-2.5 text-primary" />
                    </div>
                    <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tech stack */}
            <Card className="border-border/50 bg-background/60 p-5 shadow-sm">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                Tech Stack
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium"
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
  );
};

export default Hero;
