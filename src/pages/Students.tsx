import { useState, useEffect } from "react";
import { Student } from "@/types/calendar";
import StudentDialog from "@/components/Students/StudentDialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface StudentsPageProps {
  students: Student[];
  onAddStudent: () => void;
}

export default function Students({ students, onAddStudent }: StudentsPageProps) {
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
      localStorage.setItem('students', JSON.stringify(newStudents));
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
    const updatedStudents = students.filter(student => student.id !== studentId);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b bg-white">
          <h1 className="text-2xl font-semibold text-gray-900">Öğrenciler</h1>
          <div className="ml-auto">
            <Button onClick={onAddStudent}>
              <Plus className="h-4 w-4 mr-2" />
              Öğrenci Ekle
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id} className="flex flex-col">
                <CardContent className="flex-1 p-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-semibold"
                      style={{ backgroundColor: student.color }}
                    >
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      {student.email && (
                        <p className="text-sm text-gray-500">{student.email}</p>
                      )}
                      {student.phone && (
                        <p className="text-sm text-gray-500">{student.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 bg-gray-50">
                  <div className="flex justify-end gap-2 w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Düzenle
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
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
    </div>
  );
}