import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import StudentDialog from "@/components/Students/StudentDialog";
import StudentCard from "@/components/Students/StudentCard";
import { Student } from "@/types/calendar";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import SideMenu from "@/components/Layout/SideMenu";

export default function StudentsManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#1a73e8");
  const { students, saveStudent, deleteStudent } = useStudents();

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentPrice(student.price);
    setStudentColor(student.color || "#1a73e8");
    setIsDialogOpen(true);
  };

  const handleSaveStudent = () => {
    const studentData: Student = {
      id: selectedStudent?.id || crypto.randomUUID(),
      name: studentName,
      price: studentPrice,
      color: studentColor,
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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu 
              onAddStudent={() => setIsDialogOpen(true)}
              onEdit={handleEditStudent}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 border-b bg-background">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-semibold text-foreground truncate">
              Öğrenci Yönetimi
            </h1>
            <div className="ml-auto">
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Öğrenci Ekle
              </Button>
            </div>
          </div>

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
      </div>
    </SidebarProvider>
  );
}