import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingScreen from "@/components/common/LoadingScreen";
import { useIsAuthenticatedQuery } from "./authApi";

function PublicOnlyRoute() {
  const location = useLocation();
  const { data, isLoading, isFetching } = useIsAuthenticatedQuery();

  if (isLoading || isFetching) {
    return <LoadingScreen message="Checking session..." />;
  }

  if (data) {
    const from = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate to="/app/dashboard" replace state={{ from, redirected: true }} />
    );
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
