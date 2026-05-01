import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingScreen from "@/components/common/LoadingScreen";

import { selectIsAuthLoading } from "../store/authSlice";

function PublicOnlyRoute() {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector(selectIsAuthLoading);

  if (isLoading) {
    return <LoadingScreen message="Checking session..." />;
  }

  if (isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to="/app/dashboard"
        replace
        state={{ from, redirected: true }}
      />
    );
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
