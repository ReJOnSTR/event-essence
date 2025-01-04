import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { AuthHeader } from "@/components/Auth/AuthHeader";
import StudentsManagementPage from "./StudentsManagementPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import SideMenu from "@/components/Layout/SideMenu";

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
          <Route path="/calendar" element={<CalendarPageContent />} />
          <Route path="/students" element={<StudentsManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const CalendarPageContent = () => {
  const [studentDialogState, setStudentDialogState] = useState({
    selectedStudent: null,
    studentName: "",
    studentPrice: 0,
    studentColor: "#1a73e8"
  });
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);

  return (
    <div className="flex-1 overflow-hidden">
      {/* Calendar content will go here */}
    </div>
  );
};

const CalendarPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider defaultOpen={true}>
          <BrowserRouter>
            <div className="min-h-screen flex w-full overflow-hidden bg-background">
              <AuthHeader />
              <div className="flex flex-1 h-full">
                <Sidebar>
                  <SidebarContent>
                    <SideMenu
                      onEdit={(student) => {
                        setStudentDialogState({
                          selectedStudent: student,
                          studentName: student.name,
                          studentPrice: student.price,
                          studentColor: student.color || "#1a73e8"
                        });
                        setIsStudentDialogOpen(true);
                      }}
                      onAddStudent={() => setIsStudentDialogOpen(true)}
                    />
                  </SidebarContent>
                </Sidebar>
                <main className="flex-1 overflow-hidden">
                  <Toaster />
                  <Sonner position="bottom-center" className="sm:bottom-4 bottom-0" expand />
                  <AnimatedRoutes />
                </main>
              </div>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default CalendarPage;