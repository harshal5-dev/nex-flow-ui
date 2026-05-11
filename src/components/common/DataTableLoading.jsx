import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const CELL_WIDTHS = ["w-20", "w-24", "w-28", "w-32"];

const DataTableLoading = ({
  rows = 5,
  columns = 6,
  withLeadingAvatar = true,
  withActionsColumn = true,
  className,
  tableClassName,
}) => {
  const rowCount = Math.max(1, rows);
  const columnCount = Math.max(2, columns);
  const rowIndexes = Array.from({ length: rowCount }, (_, index) => index);
  const columnIndexes = Array.from(
    { length: columnCount },
    (_, index) => index
  );

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border/40 bg-card/40",
        className
      )}
    >
      <Table className={cn("min-w-170", tableClassName)}>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/30 hover:bg-muted/30">
            {columnIndexes.map((columnIndex) => {
              const isActionColumn =
                withActionsColumn && columnIndex === columnCount - 1;
              return (
                <TableHead
                  key={`loading-head-${columnIndex}`}
                  className={cn("py-4", isActionColumn && "text-right")}
                >
                  <Skeleton
                    className={cn(
                      "h-3.5 rounded-md",
                      isActionColumn
                        ? "ml-auto w-10"
                        : CELL_WIDTHS[columnIndex % CELL_WIDTHS.length]
                    )}
                  />
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowIndexes.map((rowIndex) => (
            <TableRow
              key={`loading-row-${rowIndex}`}
              className="border-border/40 hover:bg-muted/10"
            >
              {columnIndexes.map((columnIndex) => {
                const isFirstColumn = columnIndex === 0;
                const isActionColumn =
                  withActionsColumn && columnIndex === columnCount - 1;

                return (
                  <TableCell
                    key={`loading-cell-${rowIndex}-${columnIndex}`}
                    className={cn(
                      "py-4",
                      isActionColumn && "text-right",
                      isFirstColumn && withLeadingAvatar && "min-w-55"
                    )}
                  >
                    {isFirstColumn && withLeadingAvatar ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-3.5 w-32 rounded-md" />
                          <Skeleton className="h-3 w-24 rounded-md" />
                        </div>
                      </div>
                    ) : isActionColumn ? (
                      <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                    ) : (
                      <Skeleton
                        className={cn(
                          "h-3.5 rounded-md",
                          CELL_WIDTHS[
                            (rowIndex + columnIndex) % CELL_WIDTHS.length
                          ]
                        )}
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTableLoading;
