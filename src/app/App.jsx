import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/features/home/pages/Home";
import {
  Signin,
  Signup,
  ForgotPassword,
  ProtectedRoute,
  PublicOnlyRoute,
  useGetUserProfileQuery,
  Profile,
} from "@/features/auth";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import Team from "@/features/user/Team";
import AccessDenied from "@/app/pages/AccessDenied";
import NotFound from "@/app/pages/NotFound";
import LoadingScreen from "@/components/common/LoadingScreen";

export function App() {
  const { isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Auth-protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Dashboard />} />
          <Route path="tasks" element={<Dashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
