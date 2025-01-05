import { useState, useEffect } from "react";
import { useStudents } from "@/hooks/useStudents";
import StudentDialog from "@/components/Students/StudentDialog";
import StudentCard from "@/components/Students/StudentCard";
import { Student } from "@/types/calendar";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

export default function StudentsManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");
  const { students, saveStudent, deleteStudent } = useStudents();
  const session = useSession();

  useEffect(() => {
    // Öğrenci düzenleme event listener'ı
    const handleEditStudent = (event: CustomEvent<Student>) => {
      const student = event.detail;
      setSelectedStudent(student);
      setStudentName(student.name);
      setStudentPrice(student.price);
      setStudentColor(student.color || "#1a73e8");
      setIsDialogOpen(true);
    };

    // Yeni öğrenci ekleme event listener'ı
    const handleAddStudent = () => {
      setSelectedStudent(undefined);
      setStudentName("");
      setStudentPrice(0);
      setStudentColor("#1a73e8");
      setIsDialogOpen(true);
    };

    window.addEventListener('editStudent', handleEditStudent as EventListener);
    window.addEventListener('addStudent', handleAddStudent);

    return () => {
      window.removeEventListener('editStudent', handleEditStudent as EventListener);
      window.removeEventListener('addStudent', handleAddStudent);
    };
  }, []);

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentPrice(student.price);
    setStudentColor(student.color || "#1a73e8");
    setIsDialogOpen(true);
  };

  const handleSaveStudent = () => {
    if (!session?.user?.id) return;
    
    const studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
      name: studentName,
      price: studentPrice,
      color: studentColor,
      user_id: session.user.id
    };
    
    saveStudent(studentData);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentPrice(0);
    setStudentColor("#1a73e8");
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader 
        title="Öğrenci Yönetimi"
        actions={
          <Button onClick={() => setIsDialogOpen(true)}>
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
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
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
    </div>
  );
}
