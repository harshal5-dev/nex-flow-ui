import { cn } from "@/lib/utils";
import { getPermissionLabel, getPermissionStyle } from "../lib/user.utils";

const PermissionChip = ({ permission }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        getPermissionStyle(permission)
      )}
    >
      {getPermissionLabel(permission)}
    </span>
  );
};

export default PermissionChip;
