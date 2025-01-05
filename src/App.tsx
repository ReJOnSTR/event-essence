import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { SessionProvider } from "@/components/Auth/SessionProvider";
import { AppLayout } from "@/components/Layout/AppLayout";
import CalendarPage from "./pages/CalendarPage";
import StudentsManagementPage from "./pages/StudentsManagementPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import StudentDialog from "@/components/Students/StudentDialog";
import { useStudentStore } from "@/store/studentStore";
import { useStudents } from "@/hooks/useStudents";

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
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <SidebarProvider defaultOpen={true}>
            <BrowserRouter>
              <SessionProvider>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/students" element={<StudentsManagementPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/" element={<Navigate to="/calendar" replace />} />
                  </Route>
                </Routes>
              </SessionProvider>
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