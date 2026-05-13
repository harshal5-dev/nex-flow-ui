import { useMemo } from "react";

import {
  PERMISSION_LABELS,
  PERMISSION_STYLES,
} from "../constants/user.contants";
import { getPermissionLabel } from "../lib/user.utils";
import MultiSelectField from "@/components/common/MultiSelectField";

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

  // Merge base options with any extra selected values that might not be in the catalog
  const mergedOptions = useMemo(() => {
    const allPermissions = new Set([
      ...baseOptions.map((permission) => permission.value),
      ...selectedPermissions,
    ]);

    return Array.from(allPermissions).map((permission) => ({
      value: permission,
      label: getPermissionLabel(permission),
      subtitle: permission,
    }));
  }, [baseOptions, selectedPermissions]);

  const renderOption = (option) => (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-foreground">
        {option.label}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">
        {option.subtitle ?? option.value}
      </p>
    </div>
  );

  return (
    <MultiSelectField
      value={selectedPermissions}
      onChange={onChange}
      options={mergedOptions}
      placeholder="Select permissions"
      searchPlaceholder="Search permissions..."
      title="Permission Library"
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      showSelectAll
      renderOption={renderOption}
      {...controlProps}
    />
  );
};

export default PermissionMultiSelect;
