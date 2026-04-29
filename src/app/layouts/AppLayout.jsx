const AppLayout = ({ children }) => {
  return (
    <div className="relative min-h-svh overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(109,40,217,0.2),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(196,181,253,0.2),transparent_36%),radial-gradient(circle_at_70%_90%,rgba(91,33,182,0.18),transparent_34%)]" />
      {children}
    </div>
  );
};

export default AppLayout;
