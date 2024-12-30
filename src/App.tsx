import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import StudentDialog from "./components/Students/StudentDialog";
import { Student } from "./types/calendar";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

const App = () => {
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(() => {
    const storedStudents = localStorage.getItem('students');
    return storedStudents ? JSON.parse(storedStudents) : [];
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentColor, setStudentColor] = useState("#1a73e8");
  const { toast } = useToast();

  const handleSaveStudent = () => {
    if (selectedStudent) {
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id
          ? {
              ...student,
              name: studentName,
              email: studentEmail,
              phone: studentPhone,
              color: studentColor,
            }
          : student
      );
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      toast({
        title: "Öğrenci güncellendi",
        description: "Öğrenci bilgileri başarıyla güncellendi.",
      });
    } else {
      const newStudent: Student = {
        id: crypto.randomUUID(),
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        color: studentColor,
      };
      const newStudents = [...students, newStudent];
      setStudents(newStudents);
      localStorage.setItem('students', JSON.stringify(newStudents));
      toast({
        title: "Öğrenci eklendi",
        description: "Yeni öğrenci başarıyla eklendi.",
      });
    }
    handleCloseStudentDialog();
  };

  const handleCloseStudentDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentColor("#1a73e8");
  };

  const handleAddStudent = () => {
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentColor("#1a73e8");
    setIsStudentDialogOpen(true);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentEmail(student.email || "");
    setStudentPhone(student.phone || "");
    setStudentColor(student.color || "#1a73e8");
    setIsStudentDialogOpen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Index 
                students={students}
                onAddStudent={handleAddStudent}
                onStudentClick={handleStudentClick}
              />
            } />
            <Route path="/students" element={
              <Students 
                students={students}
                onAddStudent={handleAddStudent}
                onStudentClick={handleStudentClick}
              />
            } />
            <Route path="/reports" element={
              <Reports 
                students={students}
                onAddStudent={handleAddStudent}
                onStudentClick={handleStudentClick}
              />
            } />
            <Route path="/settings" element={
              <Settings 
                students={students}
                onAddStudent={handleAddStudent}
                onStudentClick={handleStudentClick}
              />
            } />
          </Routes>
          <StudentDialog
            isOpen={isStudentDialogOpen}
            onClose={handleCloseStudentDialog}
            onSave={handleSaveStudent}
            student={selectedStudent}
            studentName={studentName}
            setStudentName={setStudentName}
            studentEmail={studentEmail}
            setStudentEmail={setStudentEmail}
            studentPhone={studentPhone}
            setStudentPhone={setStudentPhone}
            studentColor={studentColor}
            setStudentColor={setStudentColor}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;