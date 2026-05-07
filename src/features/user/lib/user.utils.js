import {
  PERMISSION_LABELS,
  PERMISSION_STYLES,
} from "../constants/user.contants";

const normalizePermissionKey = (permission) =>
  String(permission ?? "").toUpperCase();

export const getPermissionLabel = (permission) => {
  const key = normalizePermissionKey(permission);
  return (
    PERMISSION_LABELS[key] ??
    key
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ")
  );
};

export const getPermissionStyle = (permission) => {
  const key = normalizePermissionKey(permission);
  return PERMISSION_STYLES[key] ?? "bg-muted text-muted-foreground";
};
