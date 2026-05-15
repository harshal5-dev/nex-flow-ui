import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailSkeleton = () => {
  return (
    <main className="space-y-6">
      {/* Header skeleton */}
      <Card className="space-y-6 border-border/40 bg-card/60 p-6 shadow-md sm:p-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-9 w-96" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-px" />
          <Skeleton className="h-5 w-32" />
        </div>
      </Card>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-10" />
              </div>
              <Skeleton className="size-11 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card className="space-y-4 border-border/40 bg-card/60 p-6 shadow-sm">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-2.5 w-full rounded-full" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </Card>
          <Card className="space-y-2 border-border/40 bg-card/60 p-6 shadow-sm">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="space-y-4 border-border/40 bg-card/60 p-6 shadow-sm">
            <Skeleton className="h-6 w-20" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetailSkeleton;
