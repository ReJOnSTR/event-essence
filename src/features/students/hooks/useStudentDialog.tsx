
import { useState } from "react";
import { Student } from "@/types/calendar";
import { useStudents } from "@/hooks/useStudents";

export function useStudentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");
  const [isSaving, setIsSaving] = useState(false);
  
  const { saveStudent, deleteStudent } = useStudents();

  const handleSave = async () => {
    if (isSaving || !studentName.trim()) return;
    
    setIsSaving(true);
    try {
      const student: Student = {
        id: selectedStudent?.id || crypto.randomUUID(),
        name: studentName,
        price: studentPrice,
        color: studentColor,
      };
      
      await saveStudent(student);
      handleClose();
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isSaving || !selectedStudent) return;
    
    setIsSaving(true);
    try {
      await deleteStudent(selectedStudent.id);
      handleClose();
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentPrice(0);
    setStudentColor("#1a73e8");
  };

  return {
    isOpen,
    setIsOpen,
    selectedStudent,
    setSelectedStudent,
    studentName,
    setStudentName,
    studentPrice,
    setStudentPrice,
    studentColor,
    setStudentColor,
    isSaving,
    handleSave,
    handleDelete,
    handleClose,
  };
}
