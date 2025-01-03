import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import SharedSideMenu from "@/components/Layout/SharedSideMenu";
import StudentDialog from "@/components/Students/StudentDialog";
import { Student } from "@/types/calendar";
import { useStudents } from "@/hooks/useStudents";
import StatsCards from "@/components/Reports/StatsCards";
import ReportFilters from "@/components/Reports/ReportFilters";
import LessonList from "@/components/Reports/LessonList";

export default function ReportsPage() {
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const { students } = useStudents();

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentDialogOpen(true);
  };

  const handleCloseStudentDialog = () => {
    setIsStudentDialogOpen(false);
    setSelectedStudent(undefined);
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
        />
      </div>
    </SidebarProvider>
  );
}
