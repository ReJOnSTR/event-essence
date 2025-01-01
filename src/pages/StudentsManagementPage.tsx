import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Student } from "@/types/calendar";
import StudentDialog from "@/components/Students/StudentDialog";
import StudentList from "@/components/Students/StudentList";
import StudentCard from "@/components/Students/StudentCard";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#9b87f5");
  const { toast } = useToast();

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  const handleSaveStudent = () => {
    if (selectedStudent) {
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id
          ? {
              ...student,
              name: studentName,
              price: studentPrice,
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
        price: studentPrice,
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

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentPrice(student.price);
    setStudentColor(student.color || "#9b87f5");
    setIsStudentDialogOpen(true);
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      const updatedStudents = students.filter(student => student.id !== selectedStudent.id);
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      toast({
        title: "Öğrenci silindi",
        description: "Öğrenci başarıyla silindi.",
      });
      handleCloseStudentDialog();
    }
  };

  const handleCloseStudentDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentPrice(0);
    setStudentColor("#9b87f5");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <StudentList
              students={students}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Takvime Dön</span>
            </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={handleEditStudent}
                />
              ))}
            </div>
          </div>
        </div>

        <StudentDialog
          isOpen={isStudentDialogOpen}
          onClose={handleCloseStudentDialog}
          onSave={handleSaveStudent}
          onDelete={handleDeleteStudent}
          student={selectedStudent}
          studentName={studentName}
          setStudentName={setStudentName}
          studentPrice={studentPrice}
          setStudentPrice={setStudentPrice}
          studentColor={studentColor}
          setStudentColor={setStudentColor}
        />
      </div>
    </SidebarProvider>
  );
}