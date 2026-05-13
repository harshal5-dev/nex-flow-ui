import MultiSelectField from "@/components/common/MultiSelectField";
import UserAvatar from "@/components/common/UserAvatar";
import { getUserFullName } from "@/lib/utils";
import { useMemo } from "react";

const AssigneeMultiSelect = ({
  value = [],
  onChange,
  options = [],
  isLoading = false,
  disabled = false,
  ...triggerProps
}) => {
  const multiSelectOptions = useMemo(
    () =>
      options.map((user) => ({
        value: user._id ?? user.id,
        label: getUserFullName(user),
        subtitle: user.emailId ?? "",
        firstName: user.firstName,
        lastName: user.lastName,
      })),
    [options]
  );

  const renderOption = (option) => (
    <div className="flex items-center gap-2">
      <UserAvatar
        size="sm"
        firstName={option.firstName}
        lastName={option.lastName}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {option.label}
        </p>
        {option.subtitle ? (
          <p className="truncate text-[11px] text-muted-foreground">
            {option.subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );

  const filterFn = (option, query) => {
    const name = option.label.toLowerCase();
    const email = String(option.subtitle ?? "").toLowerCase();
    return name.includes(query) || email.includes(query);
  };

  return (
    <MultiSelectField
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      options={multiSelectOptions}
      placeholder="Assign team members"
      searchPlaceholder="Search users..."
      title="Team Directory"
      emptyMessage="No users available."
      isLoading={isLoading}
      disabled={disabled}
      showSelectAll={false}
      renderOption={renderOption}
      filterFn={filterFn}
      {...triggerProps}
    />
  );
};

export default AssigneeMultiSelect;
