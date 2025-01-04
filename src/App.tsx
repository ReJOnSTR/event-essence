import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthHeader } from "@/components/Auth/AuthHeader";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const AnimatedRoutes = ({ headerHeight }: { headerHeight: number }) => {
  const location = useLocation();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Routes location={location}>
      <Route path="/calendar" element={<CalendarPage headerHeight={headerHeight} />} />
      <Route path="/students" element={<StudentsManagementPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/" element={<Navigate to="/calendar" replace />} />
    </Routes>
  );
};

const App = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <BrowserRouter>
            <div className="min-h-screen flex w-full overflow-hidden bg-background">
              <AuthHeader onHeightChange={setHeaderHeight} />
              <div className="w-full" style={{ marginTop: headerHeight }}>
                <Toaster />
                <Sonner position="bottom-center" className="sm:bottom-4 bottom-0" expand />
                <AnimatedRoutes headerHeight={headerHeight} />
              </div>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;