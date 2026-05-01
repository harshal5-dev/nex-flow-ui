import { useNavigate } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";

import ThemeToggleButton from "@/components/common/ThemeToggleButton";
import LogoBrand from "@/components/common/LogoBrand";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="animate-in duration-500 fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 px-3 py-2 shadow-sm backdrop-blur-md sm:px-4 sm:py-2.5">
        {/* Brand */}
        <LogoBrand size="sm" subtitle="Project Management" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggleButton />

          <Separator
            orientation="vertical"
            className="mx-0.5 h-5 bg-border/60"
          />

          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </Button>

          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => navigate("/signup")}
          >
            Get Started
            <IconArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
