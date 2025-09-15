import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarRail
} from "@/components/ui/sidebar";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import AuthHeader from "@/components/Auth/AuthHeader";
import SideMenu from "@/components/Layout/SideMenu";
import StudentDialog from "@/components/Students/StudentDialog";
import { useStudentStore } from "@/store/studentStore";
import { useStudents } from "@/hooks/useStudents";
import { AppRoutes } from "./routes/AppRoutes";
import { InstallPrompt } from "@/components/PWA/InstallPrompt";

function AppContent() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  
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
    <>
      <InstallPrompt />
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
        <AnimatePresence mode="wait" initial={false}>
          <AppRoutes headerHeight={headerHeight} location={location} />
        </AnimatePresence>
      </div>
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
      </div>
    </>
  );
}

const App = () => {
  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
    >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <SidebarProvider defaultOpen={true}>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
      <Toaster />
      <Sonner />
    </SessionContextProvider>
  );
};

export default App;