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
import AuthHeader from "@/components/Auth/AuthHeader";
import AuthGuard from "@/components/Auth/AuthGuard";
import SideMenu from "@/components/Layout/SideMenu";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import StudentDialog from "@/components/Students/StudentDialog";
import { useStudentStore } from "@/store/studentStore";
import { useStudents } from "@/hooks/useStudents";
import { useState } from "react";

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
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthGuard><ProtectedLayout /></AuthGuard>}>
            <Route path="/calendar" element={<CalendarPage headerHeight={headerHeight} />} />
            <Route path="/students" element={<StudentsManagementPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const ProtectedLayout = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <AuthHeader 
        onHeightChange={setHeaderHeight} 
        onSearchChange={setSearchTerm}
      />
      <div className="flex-1 flex flex-col">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full overflow-hidden bg-background">
            <Sidebar>
              <SidebarContent className="p-4" style={{ marginTop: headerHeight }}>
                <SideMenu searchTerm={searchTerm} />
              </SidebarContent>
              <SidebarRail />
            </Sidebar>
            <div className="flex-1">
              <Routes>
                <Route path="/calendar" element={<CalendarPage headerHeight={headerHeight} />} />
                <Route path="/students" element={<StudentsManagementPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

const App = () => {
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
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <BrowserRouter>
          <AnimatedRoutes headerHeight={0} />
        </BrowserRouter>
      </TooltipProvider>
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
    </ThemeProvider>
  );
};

export default App;