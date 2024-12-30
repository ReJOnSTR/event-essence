import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import { Student } from "./types/calendar";

const queryClient = new QueryClient();

const App = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const handleAddStudent = () => {
    // This will be handled by the Students component
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index students={students} onAddStudent={handleAddStudent} />} />
            <Route path="/students" element={<Students students={students} onAddStudent={handleAddStudent} />} />
            <Route path="/reports" element={<Reports students={students} onAddStudent={handleAddStudent} />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;