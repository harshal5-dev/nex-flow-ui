import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingScreen from "@/components/common/LoadingScreen";
import {
  selectIsAuthenticated,
  selectIsAuthLoading,
} from "../../store/authSlice";

function getRedirectPath(location) {
  return `${location.pathname}${location.search}${location.hash}`;
}

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsAuthLoading);

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

  if (isLoading) {
    return <LoadingScreen message="Verifying access..." />;
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: getRedirectPath(location) }}
      />
    );
  }

  // if (error) {
  //   const status = error?.status;
  //   const message =
  //     error?.data?.message ||
  //     "We could not verify your current session. Please try again.";
  //   const isUnauthorized = status === 401;
  //   const isForbidden = status === 403;

  //   if (isUnauthorized) {
  //     return (
  //       <Navigate
  //         to="/signin"
  //         replace
  //         state={{ from: getRedirectPath(location) }}
  //       />
  //     );
  //   }

  //   if (isForbidden) {
  //     return (
  //       <Navigate
  //         to="/access-denied"
  //         replace
  //         state={{ from: getRedirectPath(location) }}
  //       />
  //     );
  //   }

  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
  //       <StatusCallout
  //         variant="error"
  //         title="Could not verify your session"
  //         message={message}
  //         action={
  //           <div className="flex gap-2">
  //             <Button
  //               type="button"
  //               variant="outline"
  //               size="sm"
  //               onClick={refetch}
  //             >
  //               Retry
  //             </Button>
  //             <Button type="button" size="sm" asChild>
  //               <Link to="/signin">Go to sign in</Link>
  //             </Button>
  //           </div>
  //         }
  //         className="w-full max-w-lg"
  //       />
  //     </div>
  //   );
  // }

  return <Outlet />;
};

export default ProtectedRoute;
