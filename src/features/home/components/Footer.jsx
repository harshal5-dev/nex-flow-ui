import { Separator } from "@/components/ui/separator";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="animate-in pb-4 delay-500 duration-700 fade-in">
      <Separator className="mb-4 bg-border/50" />

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Next Flow &mdash; Built by{" "}
          <a
            href="https://harshalganbote.com/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground/75 underline-offset-4 hover:underline"
          >
            Harshal Ganbote
          </a>
        </p>

        {/* Social icon buttons */}
        <div className="flex items-center gap-2">
          {/* GitHub */}
          <a
            href="https://github.com/harshal5-dev/nex-flow-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border/70 bg-card text-foreground/65 shadow-xs transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground"
          >
            <IconBrandGithub className="size-4" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/harshal-ganbote"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#0a66c2]/25 bg-[#0a66c2]/8 text-[#0a66c2] shadow-xs transition-all duration-200 hover:border-[#0a66c2]/40 hover:bg-[#0a66c2]/15"
          >
            <IconBrandLinkedin className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
