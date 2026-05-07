import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "../ui/button";

const PaginationFooter = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
}) => {
  if (totalPages <= 1) return null;

  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-2 border-t border-border/40 bg-card/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span>-
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span>{" "}
        {itemLabel}
      </p>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <p className="text-xs text-muted-foreground">
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 gap-1 px-3 text-xs shadow-none"
          >
            <IconChevronLeft className="size-3.5" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 gap-1 px-3 text-xs shadow-none"
          >
            Next
            <IconChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationFooter;
