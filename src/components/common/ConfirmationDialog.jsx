import { IconAlertTriangle, IconLoader } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ConfirmationDialog = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  errorMessage = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  confirmVariant = "destructive",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isLoading}>
        <DialogHeader>
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-destructive/25 bg-destructive/10 text-destructive">
            <IconAlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {description}
          </DialogDescription>
          {errorMessage ? (
            <p className="mt-1 text-xs font-medium text-destructive">
              {errorMessage}
            </p>
          ) : null}
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-1.5"
          >
            {isLoading ? (
              <>
                <IconLoader className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
