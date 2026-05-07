import { useState, useMemo } from "react";
import {
  PERMISSION_LABELS,
  PERMISSION_STYLES,
} from "../constants/user.contants";
import { getPermissionLabel } from "../lib/user.utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY_PERMISSIONS = [];

const PERMISSION_OPTIONS = Object.keys(PERMISSION_STYLES).map((value) => ({
  value,
  label: PERMISSION_LABELS[value] ?? value.replaceAll("_", " "),
}));

const PermissionMultiSelect = ({
  value = [],
  onChange,
  options: providedOptions,
  isLoading = false,
  emptyMessage = "No permissions found.",
  ...controlProps
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const selectedPermissions = Array.isArray(value) ? value : EMPTY_PERMISSIONS;
  const baseOptions = useMemo(() => {
    if (!Array.isArray(providedOptions) || providedOptions.length === 0) {
      return PERMISSION_OPTIONS;
    }

    return providedOptions
      .map((option) => {
        if (typeof option === "string") {
          return {
            value: option,
            label: getPermissionLabel(option),
          };
        }

        return {
          value: option?.value,
          label: option?.label ?? getPermissionLabel(option?.value),
        };
      })
      .filter((option) => Boolean(option.value));
  }, [providedOptions]);

  const options = useMemo(() => {
    const allPermissions = new Set([
      ...baseOptions.map((permission) => permission.value),
      ...selectedPermissions,
    ]);

    return Array.from(allPermissions).map((permission) => ({
      value: permission,
      label: getPermissionLabel(permission),
    }));
  }, [baseOptions, selectedPermissions]);

  const filteredOptions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return options;
    return options.filter((permission) =>
      [permission.value, permission.label].some((text) =>
        text.toLowerCase().includes(query)
      )
    );
  }, [options, searchValue]);

  const togglePermission = (permission) => {
    if (selectedPermissions.includes(permission)) {
      onChange(selectedPermissions.filter((value) => value !== permission));
      return;
    }
    onChange([...selectedPermissions, permission]);
  };

  const clearSelection = () => onChange([]);
  const selectAll = () => onChange(baseOptions.map((item) => item.value));
  const shownPermissions = selectedPermissions.slice(0, 3);
  const remainingCount = selectedPermissions.length - shownPermissions.length;

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearchValue("");
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          {...controlProps}
          className="h-auto min-h-11 w-full justify-between gap-2 border-primary/20 bg-primary/5 px-3 py-2 text-left shadow-none hover:bg-primary/8"
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {selectedPermissions.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                Select permissions
              </span>
            ) : (
              <>
                {shownPermissions.map((permission) => (
                  <Badge
                    key={permission}
                    variant="secondary"
                    className="max-w-full truncate rounded-md border border-border/60 bg-background px-2 py-0 text-[11px]"
                  >
                    {getPermissionLabel(permission)}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-md px-2 py-0 text-[11px]"
                  >
                    +{remainingCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
          <Badge variant="secondary" className="h-6 shrink-0 rounded-full px-2">
            {selectedPermissions.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-88 max-w-[92vw] p-2">
        <div className="relative mb-2">
          <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search permissions..."
            className="h-8 pl-8 text-xs"
            onKeyDown={(event) => event.stopPropagation()}
          />
        </div>
        <div className="mb-2 rounded-md border border-border/50 bg-muted/30 px-2 py-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">
            Permission Library
          </p>
          <p className="text-[10px] text-muted-foreground">
            {selectedPermissions.length} selected from {baseOptions.length}
          </p>
        </div>
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-medium text-muted-foreground">
            {selectedPermissions.length} selected
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={selectAll}
              disabled={selectedPermissions.length === baseOptions.length}
              className="h-7 px-2 text-[11px]"
            >
              Select all
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              disabled={selectedPermissions.length === 0}
              className="h-7 px-2 text-[11px]"
            >
              Clear
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-56 space-y-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 px-1 py-1">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ) : filteredOptions.length === 0 ? (
            <p className="rounded-md px-2 py-2 text-xs text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            filteredOptions.map((permission) => {
              const isSelected = selectedPermissions.includes(permission.value);
              return (
                <DropdownMenuCheckboxItem
                  key={permission.value}
                  checked={isSelected}
                  onCheckedChange={() => togglePermission(permission.value)}
                  onSelect={(event) => event.preventDefault()}
                  className="group items-start rounded-md border border-transparent py-2 data-highlighted:bg-primary/12 data-highlighted:text-foreground data-[state=checked]:border-primary/25 data-[state=checked]:bg-primary/8"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {permission.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground group-data-highlighted:text-muted-foreground">
                      {permission.value}
                    </p>
                  </div>
                </DropdownMenuCheckboxItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PermissionMultiSelect;
