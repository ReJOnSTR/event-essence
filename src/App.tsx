import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import AuthHeader from "@/components/Auth/AuthHeader";
import SideMenu from "@/components/Layout/SideMenu";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import StudentDialog from "@/components/Students/StudentDialog";
import { useStudentStore } from "@/store/studentStore";
import { useStudents } from "@/hooks/useStudents";
import { useState, useEffect } from "react";
import { useToast } from "./components/ui/use-toast";

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

interface ProtectedRouteProps {
  children: React.ReactNode;
  headerHeight: number;
}

const ProtectedRoute = ({ children, headerHeight }: ProtectedRouteProps) => {
  const { session, isLoading } = useSessionContext();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !session) {
      toast({
        title: "Oturum gerekli",
        description: "Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
    }
  }, [session, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
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
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = ({ headerHeight }: { headerHeight: number }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute headerHeight={headerHeight}>
              <CalendarPage headerHeight={headerHeight} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/students" 
          element={
            <ProtectedRoute headerHeight={headerHeight}>
              <StudentsManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute headerHeight={headerHeight}>
              <ReportsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute headerHeight={headerHeight}>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/calendar" replace />} />
      </Routes>
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

  const handleSaveStudent = () => {
    const studentData = {
      id: selectedStudent?.id || crypto.randomUUID(),
      name: studentName,
      price: studentPrice,
      color: studentColor,
    };
    
    saveStudent(studentData);
    closeDialog();
  };

  return (
    <SessionContextProvider supabaseClient={supabase}>
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
        onDelete={selectedStudent ? () => deleteStudent(selectedStudent.id) : undefined}
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