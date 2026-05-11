import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/features/home/pages/Home";
import {
  Signin,
  Signup,
  ForgotPassword,
  AcceptInvite,
  ProtectedRoute,
  PublicOnlyRoute,
  useGetUserProfileQuery,
  Profile,
} from "@/features/auth";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import Tasks from "@/features/tasks/Tasks";
import Projects from "@/features/projects/Projects";
import AccessDenied from "@/app/pages/AccessDenied";
import NotFound from "@/app/pages/NotFound";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Team } from "@/features/user";

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
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Auth-protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="team" element={<Team />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
