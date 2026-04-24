import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

import { useIsAuthenticatedQuery } from "./authApi";
import LoadingScreen from "@/components/common/LoadingScreen";
import StatusCallout from "@/components/ui/status-callout";
import { Button } from "@/components/ui/button";

function getRedirectPath(location) {
  return `${location.pathname}${location.search}${location.hash}`;
}

const ProtectedRoute = () => {
  const location = useLocation();
  const { data, isLoading, isFetching, error, refetch } =
    useIsAuthenticatedQuery();

  if (isLoading || isFetching) {
    return <LoadingScreen message="Verifying access..." />;
  }

  if (data) {
    return <Outlet />;
  }

  if (error) {
    const {
      status,
      data: { message },
    } = error;
    const isUnauthorized = status === 401 || status === 403;

    if (isUnauthorized) {
      return (
        <Navigate
          to="/login"
          replace
          state={{ from: getRedirectPath(location) }}
        />
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <StatusCallout
          variant="error"
          title="Could not verify your session"
          message={message}
          action={
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={refetch}
              >
                Retry
              </Button>
              <Button type="button" size="sm" asChild>
                <Link to="/login">Go to login</Link>
              </Button>
            </div>
          }
          className="w-full max-w-lg"
        />
      </div>
    );
  }

  return (
    <Navigate to="/login" replace state={{ from: getRedirectPath(location) }} />
  );
};

export default ProtectedRoute;
