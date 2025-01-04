import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Student } from "@/types/calendar";
import StudentDialog from "@/components/Students/StudentDialog";
import SideMenu from "@/components/Layout/SideMenu";
import StudentCard from "@/components/Students/StudentCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BackButton } from "@/components/ui/back-button";
import { useStudents } from "@/hooks/useStudents";

export default function StudentsManagementPage() {
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");
  
  const { students, saveStudent, deleteStudent } = useStudents();
  const { toast } = useToast();

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setSelectedStudent(student);
      setStudentName(student.name);
      setStudentPrice(student.price);
      setStudentColor(student.color);
    } else {
      setSelectedStudent(undefined);
      setStudentName("");
      setStudentPrice(0);
      setStudentColor("#1a73e8");
    }
    setIsStudentDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentPrice(0);
    setStudentColor("#1a73e8");
  };

  const handleSaveStudent = () => {
    const studentData = {
      id: selectedStudent?.id || crypto.randomUUID(),
      name: studentName,
      price: studentPrice,
      color: studentColor,
    };

    saveStudent(studentData);
    
    toast({
      title: selectedStudent ? "Öğrenci güncellendi" : "Öğrenci eklendi",
      description: selectedStudent 
        ? "Öğrenci bilgileri başarıyla güncellendi."
        : "Yeni öğrenci başarıyla eklendi.",
    });

    handleCloseDialog();
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      toast({
        title: "Öğrenci silindi",
        description: "Öğrenci başarıyla silindi.",
      });
      handleCloseDialog();
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu
              onEdit={handleOpenDialog}
              onAddStudent={() => handleOpenDialog()}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <BackButton to="/" label="Takvime Dön" />
            <h1 className="text-2xl font-semibold text-gray-900">Öğrenciler</h1>
            <div className="ml-auto">
              <Button onClick={() => handleOpenDialog()}>
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
                  onClick={() => handleOpenDialog(student)}
                />
              ))}
            </div>
          </div>
        </div>

        <StudentDialog
          isOpen={isStudentDialogOpen}
          onClose={handleCloseDialog}
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
