import { useState } from "react";
import { Student } from "@/types/calendar";
import { useStudents } from "@/hooks/useStudents";

export function useStudentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");
  
  const { saveStudent, deleteStudent } = useStudents();

  const handleSave = () => {
    const student: Student = {
      id: selectedStudent?.id || crypto.randomUUID(),
      name: studentName,
      price: studentPrice,
      color: studentColor,
    };
    
    saveStudent(student);
    handleClose();
  };

  const handleDelete = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      handleClose();
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
    handleSave,
    handleDelete,
    handleClose,
  };
}