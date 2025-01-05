import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthHeader from "@/components/Auth/AuthHeader";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import CalendarPage from "@/pages/CalendarPage";
import StudentsManagementPage from "@/pages/StudentsManagementPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";

const AppRoutes = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={
              <ProtectedLayout 
                headerHeight={headerHeight} 
                searchTerm={searchTerm}
                onHeightChange={setHeaderHeight}
                onSearchChange={setSearchTerm}
              />
            }>
              <Route path="/calendar" element={<CalendarPage headerHeight={headerHeight} />} />
              <Route path="/students" element={<StudentsManagementPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/" element={<Navigate to="/calendar" replace />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
};

export default AppRoutes;