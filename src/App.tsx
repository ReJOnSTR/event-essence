import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarRail
} from "@/components/ui/sidebar";
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import AuthHeader from "@/components/Auth/AuthHeader";
import SideMenu from "@/components/Layout/SideMenu";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import StudentDialog from "@/components/Students/StudentDialog";
import { useStudentStore } from "@/store/studentStore";
import { useStudents } from "@/hooks/useStudents";

const pageVariants = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 10,
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.3
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession && !isLoading) {
        localStorage.setItem('returnUrl', location.pathname);
        navigate('/login');
      }
    };

    checkSession();
  }, [session, isLoading, navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return session ? <>{children}</> : null;
};

const AnimatedRoutes = ({ headerHeight }: { headerHeight: number }) => {
  const location = useLocation();
  
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
        style={{ 
          marginTop: headerHeight,
          transition: 'margin-top 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        <Routes location={location}>
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <CalendarPage headerHeight={headerHeight} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute>
                <StudentsManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { 
    isDialogOpen, 
    closeDialog, 
    selectedStudent,
    studentName,
    studentPrice,
    studentColor,
    setStudentName,
    setStudentPrice,
    setStudentColor 
  } = useStudentStore();
  const { saveStudent, deleteStudent } = useStudents();

  const handleSaveStudent = async () => {
    const studentData = {
      id: selectedStudent?.id || crypto.randomUUID(),
      name: studentName,
      price: studentPrice,
      color: studentColor,
    };
    
    await saveStudent(studentData);
    closeDialog();
  };

  const handleDeleteStudent = async () => {
    if (selectedStudent) {
      await deleteStudent(selectedStudent.id);
      closeDialog();
    }
  };

  return (
    <SessionContextProvider 
      supabaseClient={supabase}
    >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <SidebarProvider defaultOpen={true}>
            <BrowserRouter>
              <div className="min-h-screen flex w-full overflow-hidden bg-background">
                <Sidebar>
                  <SidebarContent className="p-4" style={{ marginTop: headerHeight }}>
                    <SideMenu searchTerm={searchTerm} />
                  </SidebarContent>
                  <SidebarRail />
                </Sidebar>
                <div className="flex-1 flex flex-col">
                  <AuthHeader 
                    onHeightChange={setHeaderHeight} 
                    onSearchChange={setSearchTerm}
                  />
                  <AnimatedRoutes headerHeight={headerHeight} />
                </div>
              </div>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
      <StudentDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSave={handleSaveStudent}
        onDelete={selectedStudent ? handleDeleteStudent : undefined}
        student={selectedStudent}
        studentName={studentName}
        setStudentName={setStudentName}
        studentPrice={studentPrice}
        setStudentPrice={setStudentPrice}
        studentColor={studentColor}
        setStudentColor={setStudentColor}
      />
      <Toaster />
      <Sonner />
    </SessionContextProvider>
  );
};

export default App;