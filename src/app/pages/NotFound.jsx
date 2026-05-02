import { useNavigate } from "react-router-dom";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconHome2,
} from "@tabler/icons-react";

import ThemeToggleButton from "@/components/common/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(109,40,217,0.2),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(196,181,253,0.2),transparent_34%),radial-gradient(circle_at_55%_90%,rgba(91,33,182,0.18),transparent_36%)]" />

      <div className="relative mx-auto flex min-h-svh w-full max-w-5xl flex-col px-6 py-8">
        <div className="mb-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-medium"
          >
            <img
              src="/branding/next-flow-mark.svg"
              alt="Next Flow"
              className="size-8 rounded-md"
            />
            <span>Next Flow</span>
          </button>
          <ThemeToggleButton />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-2xl animate-in border-border/70 bg-card/85 shadow-xl backdrop-blur duration-700 fade-in slide-in-from-bottom-4">
            <CardHeader className="items-center text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-full border border-warning/30 bg-warning/15 text-warning-foreground">
                <IconAlertTriangle className="size-7" />
              </div>
              <p className="mt-4 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Error 404
              </p>
              <CardTitle className="mt-3 text-3xl">Page Not Found</CardTitle>
              <CardDescription className="max-w-xl text-sm leading-relaxed md:text-[15px]">
                The page you are trying to open does not exist or may have been
                moved. Let&apos;s get you back to a working route.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <Card className="rounded-xl border-border/60 bg-background/70 p-4">
                Check the URL path for typos and try again.
              </Card>
              <Card className="rounded-xl border-border/60 bg-background/70 p-4">
                Use the dashboard or home page navigation to continue.
              </Card>
            </CardContent>

            <CardFooter className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <IconArrowLeft className="size-4" />
                Go Back
              </Button>
              <Button type="button" onClick={() => navigate("/")}>
                <IconHome2 className="size-4" />
                Back to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
