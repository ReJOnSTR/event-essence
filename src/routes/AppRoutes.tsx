import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoginPage from "@/pages/LoginPage";
import CalendarPage from "@/pages/CalendarPage";
import StudentsManagementPage from "@/pages/StudentsManagementPage";
import SettingsPage from "@/pages/SettingsPage";
import SettingDetailPage from "@/pages/SettingDetailPage";
import ReportsPage from "@/pages/ReportsPage";
import ProfilePage from "@/pages/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/students" element={<StudentsManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/:settingId" element={<SettingDetailPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}