import { useMemo, useState } from "react";
import { IconSearch, IconShieldCheck } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY_VALUES = [];

const RoleMultiSelect = ({
  value = [],
  onChange,
  options = [],
  isLoading = false,
  emptyMessage = "No roles found.",
  ...controlProps
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedRoleValues = Array.isArray(value) ? value : EMPTY_VALUES;

  const normalizedOptions = useMemo(
    () =>
      options
        .map((option) => {
          if (typeof option === "string") {
            return {
              value: option,
              label: option,
              subtitle: "",
              description: "",
            };
          }

          const optionValue = option?.value ?? option?._id ?? option?.id;
          if (!optionValue) return null;

          return {
            value: optionValue,
            label: option?.label ?? option?.name ?? optionValue,
            subtitle: option?.subtitle ?? option?.code ?? "",
            description: option?.description ?? "",
          };
        })
        .filter(Boolean),
    [options]
  );

  const roleMap = useMemo(
    () =>
      normalizedOptions.reduce(
        (acc, role) => ({ ...acc, [role.value]: role }),
        {}
      ),
    [normalizedOptions]
  );

  const filteredOptions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return normalizedOptions;

    return normalizedOptions.filter((role) =>
      [role.value, role.label, role.subtitle, role.description].some((text) =>
        text.toLowerCase().includes(query)
      )
    );
  }, [normalizedOptions, searchValue]);

  const toggleRole = (roleValue) => {
    if (selectedRoleValues.includes(roleValue)) {
      onChange(
        selectedRoleValues.filter((valueItem) => valueItem !== roleValue)
      );
      return;
    }

    onChange([...selectedRoleValues, roleValue]);
  };

  const clearSelection = () => onChange([]);
  const selectAll = () => onChange(normalizedOptions.map((role) => role.value));

  const shownRoles = selectedRoleValues.slice(0, 3);
  const remainingCount = selectedRoleValues.length - shownRoles.length;

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
            {selectedRoleValues.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                Select role access
              </span>
            ) : (
              <>
                {shownRoles.map((roleValue) => (
                  <Badge
                    key={roleValue}
                    variant="secondary"
                    className="max-w-full truncate rounded-md border border-border/60 bg-background px-2 py-0 text-[11px]"
                  >
                    {roleMap[roleValue]?.label ?? roleValue}
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
            {selectedRoleValues.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-88 max-w-[92vw] p-2">
        <div className="relative mb-2">
          <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search roles..."
            className="h-8 pl-8 text-xs"
            onKeyDown={(event) => event.stopPropagation()}
          />
        </div>

        <div className="mb-2 rounded-md border border-border/50 bg-muted/30 px-2 py-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">
            Role Library
          </p>
          <p className="text-[10px] text-muted-foreground">
            {selectedRoleValues.length} selected from {normalizedOptions.length}
          </p>
        </div>

        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-medium text-muted-foreground">
            {selectedRoleValues.length} selected
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={selectAll}
              disabled={
                normalizedOptions.length === 0 ||
                selectedRoleValues.length === normalizedOptions.length
              }
              className="h-7 px-2 text-[11px]"
            >
              Select all
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              disabled={selectedRoleValues.length === 0}
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
            filteredOptions.map((role) => {
              const isSelected = selectedRoleValues.includes(role.value);
              const roleSubtitle = role.subtitle || role.description || role.value;

              return (
                <DropdownMenuCheckboxItem
                  key={role.value}
                  checked={isSelected}
                  onCheckedChange={() => toggleRole(role.value)}
                  onSelect={(event) => event.preventDefault()}
                  className="group items-start rounded-md border border-transparent py-2 data-highlighted:bg-primary/12 data-highlighted:text-foreground data-[state=checked]:border-primary/25 data-[state=checked]:bg-primary/8"
                >
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <IconShieldCheck className="size-3.5 text-primary" />
                      {role.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground group-data-highlighted:text-muted-foreground">
                      {roleSubtitle}
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

export default RoleMultiSelect;
