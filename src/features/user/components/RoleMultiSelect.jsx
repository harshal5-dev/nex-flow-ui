import { useMemo } from "react";
import { IconShieldCheck } from "@tabler/icons-react";

import MultiSelectField from "@/components/common/MultiSelectField";

const EMPTY_VALUES = [];

const RoleMultiSelect = ({
  value = [],
  onChange,
  options = [],
  isLoading = false,
  emptyMessage = "No roles found.",
  ...controlProps
}) => {
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

  const renderOption = (option) => (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
        <IconShieldCheck className="size-3.5 shrink-0 text-primary" />
        {option.label}
      </p>
      {option.subtitle || option.description ? (
        <p className="truncate text-[11px] text-muted-foreground">
          {option.subtitle || option.description}
        </p>
      ) : null}
    </div>
  );

  return (
    <MultiSelectField
      value={selectedRoleValues}
      onChange={onChange}
      options={normalizedOptions}
      placeholder="Select role access"
      searchPlaceholder="Search roles..."
      title="Role Library"
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      showSelectAll
      renderOption={renderOption}
      {...controlProps}
    />
  );
};

export default RoleMultiSelect;
