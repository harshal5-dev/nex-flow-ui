import UserAvatar from "@/components/common/UserAvatar";

const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.emailId ||
  "User";

const UserAvatarGroup = ({ users = [], max = 4 }) => {
  if (!Array.isArray(users) || users.length === 0) {
    return <span className="text-xs text-muted-foreground">No members</span>;
  }

  const visibleUsers = users.slice(0, max);
  const remaining = users.length - visibleUsers.length;

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user) => (
        <UserAvatar
          key={user?._id || user?.id || getUserDisplayName(user)}
          size="sm"
          firstName={user?.firstName}
          lastName={user?.lastName}
          className="ring-2 ring-background"
          title={getUserDisplayName(user)}
        />
      ))}
      {remaining > 0 ? (
        <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-border bg-background text-[11px] font-semibold text-muted-foreground ring-2 ring-background">
          +{remaining}
        </span>
      ) : null}
    </div>
  );
};

export default UserAvatarGroup;
