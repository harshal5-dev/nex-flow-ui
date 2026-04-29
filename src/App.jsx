import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Signin from "@/modules/auth/signin/Signin";
import Signup from "@/modules/auth/signup/Signup";
import ForgotPassword from "@/modules/auth/forgot-password/ForgotPassword";
import AppLayout from "@/pages/app/AppLayout";
import Dashboard from "@/pages/app/Dashboard";
import Team from "@/pages/app/Team";
import Profile from "@/pages/app/Profile";
import AccessDenied from "@/pages/AccessDenied";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "./modules/auth/ProtectedRoute";
import PublicOnlyRoute from "./modules/auth/PublicOnlyRoute";
import { useIsAuthenticatedQuery } from "./api/authApi";

export function App() {
  const cookies = window.document.cookie;
  console.log("App - Current cookies:", cookies);
  useIsAuthenticatedQuery(); // Trigger auth check on app load
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
        <Route path="/app" element={<AppLayout />}>
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
