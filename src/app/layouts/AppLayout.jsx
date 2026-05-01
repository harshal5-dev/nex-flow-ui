const AppLayout = ({ children }) => {
  return (
    <div className="relative min-h-svh overflow-x-hidden bg-background text-foreground">
      {/* Square grid */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      {/* Soft violet glow from the top — sits above the grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-5%,rgba(109,40,217,0.10),transparent)]" />
      {children}
    </div>
  );
};

export default AppLayout;
