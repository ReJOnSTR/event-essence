import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import { Student } from "@/types/calendar";
import StudentDialog from "./components/Students/StudentDialog";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

const AppContent = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentColor, setStudentColor] = useState("#1a73e8");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddStudent = () => {
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentColor("#1a73e8");
    setIsStudentDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentEmail(student.email || "");
    setStudentPhone(student.phone || "");
    setStudentColor(student.color || "#1a73e8");
    setIsStudentDialogOpen(true);
    navigate("/students");
  };

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

  const commonProps = {
    students,
    onAddStudent: handleAddStudent,
    onEditStudent: handleEditStudent,
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index {...commonProps} />} />
        <Route path="/students" element={<Students {...commonProps} />} />
        <Route path="/reports" element={<Reports {...commonProps} />} />
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
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;