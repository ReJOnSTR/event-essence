import { useState } from "react";
import { Student } from "@/types/calendar";
import StudentList from "@/components/Students/StudentList";
import StudentDialog from "@/components/Students/StudentDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
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
      setStudents([...students, newStudent]);
      toast({
        title: "Öğrenci eklendi",
        description: "Yeni öğrenci başarıyla eklendi.",
      });
    }
    handleCloseStudentDialog();
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentEmail(student.email || "");
    setStudentPhone(student.phone || "");
    setStudentColor(student.color || "#1a73e8");
    setIsStudentDialogOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(student => student.id !== studentId));
    toast({
      title: "Öğrenci silindi",
      description: "Öğrenci başarıyla silindi.",
    });
  };

  const handleCloseStudentDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentColor("#1a73e8");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Öğrenciler</h1>
        <Button 
          onClick={() => {
            setIsStudentDialogOpen(true);
            setSelectedStudent(undefined);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Öğrenci Ekle
        </Button>
      </div>

      <StudentList
        students={students}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />

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
    </div>
  );
}