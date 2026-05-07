import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const DataGridLoading = ({
  count = 3,
  gridClassName = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
  cardClassName,
}) => {
  return (
    <div className={cn(gridClassName)}>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={`grid-loading-card-${index}`}
          className={cn(
            "overflow-hidden border border-border/40 bg-background/50 shadow-sm",
            cardClassName
          )}
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DataGridLoading;
