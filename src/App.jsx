import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/modules/auth/signup/Signup";
import AppLayout from "@/pages/app/AppLayout";
import Dashboard from "@/pages/app/Dashboard";
import Team from "@/pages/app/Team";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Dashboard />} />
        <Route path="tasks" element={<Dashboard />} />
        <Route path="team" element={<Team />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
