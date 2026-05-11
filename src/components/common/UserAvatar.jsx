import { cn, getUserInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

const AVATAR_THEMES = [
  {
    shell: "from-primary/18 to-primary/6 border-primary/30",
    orbA: "bg-primary/45",
    orbB: "bg-primary/22",
    stripe: "bg-primary/25",
  },
  {
    shell: "from-info/18 to-info/6 border-info/30",
    orbA: "bg-info/45",
    orbB: "bg-info/22",
    stripe: "bg-info/25",
  },
  {
    shell: "from-success/18 to-success/6 border-success/30",
    orbA: "bg-success/45",
    orbB: "bg-success/22",
    stripe: "bg-success/25",
  },
  {
    shell: "from-warning/18 to-warning/6 border-warning/30",
    orbA: "bg-warning/45",
    orbB: "bg-warning/22",
    stripe: "bg-warning/25",
  },
  {
    shell: "from-destructive/18 to-destructive/6 border-destructive/30",
    orbA: "bg-destructive/40",
    orbB: "bg-destructive/20",
    stripe: "bg-destructive/20",
  },
  {
    shell: "from-pending/18 to-pending/6 border-pending/30",
    orbA: "bg-pending/45",
    orbB: "bg-pending/22",
    stripe: "bg-pending/25",
  },
];

function getAvatarTheme(name) {
  const code = (name?.charCodeAt(0) ?? 0) + (name?.charCodeAt(1) ?? 0);
  return AVATAR_THEMES[code % AVATAR_THEMES.length];
}

const UserAvatar = ({ firstName, lastName, size = "md", className }) => {
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  const theme = getAvatarTheme(displayName);
  const sizeClass = {
    sm: "size-9 text-[10px]",
    md: "size-11 text-xs",
    lg: "size-[3.25rem] text-sm",
  }[size];

  return (
    <Avatar
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-0.5 shadow-sm ring-1 ring-border/30",
        sizeClass,
        className
      )}
      title={displayName || "User"}
    >
      <AvatarFallback
        className={cn(
          "relative flex size-full items-center justify-center rounded-[0.8rem] bg-linear-to-br",
          theme.shell
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute -top-3 -right-2 size-8 rounded-full blur-[0.5px]",
            theme.orbA
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute -bottom-4 -left-3 size-11 rounded-full",
            theme.orbB
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-1.5",
            theme.stripe
          )}
        />
        <span className="relative z-10 inline-flex min-w-7 items-center justify-center rounded-md border border-white/75 bg-white/80 px-1.5 py-0.5 text-[0.78em] font-extrabold tracking-wide text-foreground shadow-sm backdrop-blur dark:text-primary">
          {getUserInitials({ firstName, lastName })}
        </span>
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
