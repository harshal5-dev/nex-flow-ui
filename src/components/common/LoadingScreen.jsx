const LoadingScreen = ({ message }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm text-muted-foreground">
            {message || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
