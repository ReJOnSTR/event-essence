import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import StudentDialog from "@/components/Students/StudentDialog";
import StudentCard from "@/components/Students/StudentCard";
import { Student } from "@/types/calendar";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useSessionContext } from '@supabase/auth-helpers-react';
import LoginRequiredDialog from "@/components/Auth/LoginRequiredDialog";
import { useStudentDialog } from "@/features/students/hooks/useStudentDialog";

export default function StudentsManagementPage() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { session } = useSessionContext();
  const { students } = useStudents();
  const studentDialog = useStudentDialog();

  const handleAddStudent = () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    studentDialog.setIsOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    studentDialog.setSelectedStudent(student);
    studentDialog.setStudentName(student.name);
    studentDialog.setStudentPrice(student.price);
    studentDialog.setStudentColor(student.color || "#1a73e8");
    studentDialog.setIsOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader 
        title="Öğrenci Yönetimi"
        actions={
          <Button onClick={handleAddStudent} disabled={studentDialog.isSaving}>
            <Plus className="h-4 w-4 mr-2" />
            Öğrenci Ekle
          </Button>
        }
      />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-auto">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onClick={handleEditStudent}
          />
        ))}
      </div>

      <StudentDialog
        isOpen={studentDialog.isOpen}
        onClose={studentDialog.handleClose}
        onSave={studentDialog.handleSave}
        onDelete={studentDialog.selectedStudent ? () => studentDialog.handleDelete() : undefined}
        student={studentDialog.selectedStudent}
        studentName={studentDialog.studentName}
        setStudentName={studentDialog.setStudentName}
        studentPrice={studentDialog.studentPrice}
        setStudentPrice={studentDialog.setStudentPrice}
        studentColor={studentDialog.studentColor}
        setStudentColor={studentDialog.setStudentColor}
        isSaving={studentDialog.isSaving}
      />

      <LoginRequiredDialog 
        isOpen={isLoginDialogOpen} 
        onClose={() => setIsLoginDialogOpen(false)} 
      />
    </div>
  );
}
