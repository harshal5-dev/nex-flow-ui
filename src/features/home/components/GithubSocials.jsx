import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCode,
  IconDatabase,
  IconUsers,
  IconWorldWww,
} from "@tabler/icons-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const repositories = [
  {
    title: "Frontend",
    description:
      "React 19 UI built with shadcn/ui, Tailwind CSS 4, and Redux Toolkit. Features team, project, and task management with full dark mode support.",
    stack: "React + Vite + Tailwind",
    href: "https://github.com/harshal5-dev/nex-flow-ui",
    Icon: IconCode,
  },
  {
    title: "Backend API",
    description:
      "Node.js REST API with MongoDB database, JWT authentication, and role-based access control for workspace, project, and task operations.",
    stack: "Node.js + MongoDB",
    href: "https://github.com/harshal5-dev/Nexflow",
    Icon: IconDatabase,
  },
];

const socials = [
  {
    title: "LinkedIn",
    description: "Connect for collaboration & opportunities.",
    href: "https://www.linkedin.com/in/harshal-ganbote",
    Icon: IconBrandLinkedin,
    isLinkedIn: true,
  },
  {
    title: "Portfolio",
    description: "Explore more projects & case studies.",
    href: "https://harshalganbote.com/",
    Icon: IconWorldWww,
    isLinkedIn: false,
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const GithubSocials = () => {
  const navigate = useNavigate();

  return (
    <section
      id="connect"
      className="animate-in delay-300 duration-700 fade-in slide-in-from-bottom-3"
    >
      <Card className="border-border/50 bg-card/60 p-6 shadow-sm backdrop-blur md:p-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ── Source Code column ── */}
          <div className="flex flex-col gap-4">
            {/* Column header */}
            <div className="flex items-center gap-2">
              <div className="inline-flex size-7 items-center justify-center rounded-lg border border-border/70 bg-foreground/8">
                <IconBrandGithub className="size-3.5 text-foreground/80" />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                Source Code
              </p>
            </div>

            {/* Repo cards */}
            <div className="flex flex-col gap-3">
              {repositories.map((repo) => (
                <a
                  key={repo.title}
                  href={repo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-xl border border-border/50 bg-background/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
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
                      className="mt-2.5 border-border/60 text-[10px] font-medium text-muted-foreground"
                    >
                      {repo.stack}
                    </Badge>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Connect column ── */}
          <div className="flex flex-col gap-4">
            {/* Column header */}
            <div className="flex items-center gap-2">
              <div className="inline-flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted/60">
                <IconUsers className="size-3.5 text-foreground/70" />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                Connect
              </p>
            </div>

            {/* Social links */}
            <div className="flex flex-col gap-3">
              {socials.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-background/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div
                    className={
                      link.isLinkedIn
                        ? "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#0a66c2]/25 bg-[#0a66c2]/10 text-[#0a66c2] transition-colors group-hover:bg-[#0a66c2]/18"
                        : "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-colors group-hover:bg-primary/15"
                    }
                  >
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

            {/* CTA card */}
            <Card className="rounded-xl border-border/50 bg-muted/40 p-5">
              <p className="text-sm font-semibold">Ready to try it out?</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Sign in to explore team management, project tracking, and task
                workflows firsthand.
              </p>
              <Button
                size="sm"
                className="mt-4 gap-1.5"
                onClick={() => navigate("/signin")}
              >
                Sign In to Explore
                <IconArrowRight className="size-3.5" />
              </Button>
            </Card>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default GithubSocials;
