import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import SharedSideMenu from "@/components/Layout/SharedSideMenu";
import StudentDialog from "@/components/Students/StudentDialog";
import { Student } from "@/types/calendar";
import { useStudents } from "@/hooks/useStudents";
import { StatsCards } from "@/components/Reports/StatsCards";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { LessonList } from "@/components/Reports/LessonList";

export default function ReportsPage() {
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState("#000000");
  const { students } = useStudents();

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.name);
    setStudentPrice(student.price);
    setStudentColor(student.color || "#000000");
    setIsStudentDialogOpen(true);
  };

  const handleCloseStudentDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
    setStudentName("");
    setStudentPrice(0);
    setStudentColor("#000000");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SharedSideMenu
              onEdit={handleEditStudent}
              onAddStudent={() => setIsStudentDialogOpen(true)}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-gray-900">Raporlar</h1>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <ReportFilters />
            <StatsCards />
            <LessonList />
          </div>
        </div>

        <StudentDialog
          isOpen={isStudentDialogOpen}
          onClose={handleCloseStudentDialog}
          student={selectedStudent}
          onSave={() => {}}
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