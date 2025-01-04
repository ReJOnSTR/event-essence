import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthHeader } from "@/components/Auth/AuthHeader";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const pageVariants = {
  initial: {
    opacity: 0,
    x: -10,
    scale: 0.99
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    x: 10,
    scale: 0.99
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        <Routes location={location}>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/students" element={<StudentsManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
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
              <motion.div 
                className="w-full"
                animate={{ 
                  marginTop: headerHeight 
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <Toaster />
                <Sonner position="bottom-center" className="sm:bottom-4 bottom-0" expand />
                <AnimatedRoutes />
              </motion.div>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;