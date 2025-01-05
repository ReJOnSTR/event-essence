import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarRail
} from "@/components/ui/sidebar";
import AuthHeader from "@/components/Auth/AuthHeader";
import SideMenu from "@/components/Layout/SideMenu";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import StudentDialog from "@/components/Students/StudentDialog";
import { useStudentStore } from "@/store/studentStore";
import { useStudents } from "@/hooks/useStudents";
import { useState } from "react";

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

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
          <Route path="/calendar" element={<CalendarPage headerHeight={headerHeight} />} />
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
  const { isDialogOpen, closeDialog, selectedStudent } = useStudentStore();
  const { saveStudent, deleteStudent } = useStudents();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <SidebarProvider defaultOpen={true}>
            <BrowserRouter>
              <div className="min-h-screen flex w-full overflow-hidden bg-background">
                <Sidebar>
                  <SidebarContent className="p-4" style={{ marginTop: headerHeight }}>
                    <SideMenu />
                  </SidebarContent>
                  <SidebarRail />
                </Sidebar>
                <div className="flex-1 flex flex-col">
                  <AuthHeader onHeightChange={setHeaderHeight} />
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
    </QueryClientProvider>
  );
};

export default App;
