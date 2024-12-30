import { SidebarProvider } from "@/components/ui/sidebar";
import StudentList from "@/components/Students/StudentList";
import { useState } from "react";
import { Student } from "@/types/calendar";
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
  const [studentColor, setStudentColor] = useState("#9b87f5");
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
    setStudentColor(student.color || "#9b87f5");
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
    setStudentColor("#9b87f5");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <StudentList
          students={students}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <h1 className="text-2xl font-semibold text-gray-900">Öğrenciler</h1>
            <div className="ml-auto">
              <Button onClick={() => {
                setSelectedStudent(undefined);
                setIsStudentDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Öğrenci Ekle
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {/* Student list content will go here */}
          </div>
        </div>

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
    </SidebarProvider>
  );
}