import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { PdfReport } from "@/components/Reports/PdfReport";
import { useStudents } from "@/hooks/useStudents";
import { useLessons } from "@/hooks/useLessons";
import SideMenu from "@/components/Layout/SideMenu";
import { calculatePeriodHours, calculatePeriodEarnings } from "@/utils/reportCalculations";
import { Student } from "@/types/calendar";
import StudentDialog from "@/components/Students/StudentDialog";

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | "custom">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  // Student Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentColor, setStudentColor] = useState<string>("#000000");
  
  const { students } = useStudents();
  const { lessons } = useLessons();

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentColor(student.color || "#000000");
    setIsDialogOpen(true);
  };

  const hours = calculatePeriodHours(
    lessons,
    selectedDate,
    selectedStudent,
    startDate,
    endDate
  );

  const earnings = calculatePeriodEarnings(
    lessons,
    selectedDate,
    selectedStudent,
    students,
    startDate,
    endDate
  );

  const totalHours = selectedPeriod === "custom" 
    ? hours.custom || 0 
    : hours[selectedPeriod];

  const totalEarnings = selectedPeriod === "custom"
    ? earnings.custom || 0
    : earnings[selectedPeriod];

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
              Raporlar
            </h1>
          </div>

          <div className="p-4 space-y-4 overflow-auto">
            <ReportFilters
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              students={students}
            />
            
            <StatsCards
              hours={hours}
              earnings={earnings}
              selectedDate={selectedDate}
              startDate={startDate}
              endDate={endDate}
              selectedPeriod={selectedPeriod}
            />
            
            <LessonList
              lessons={lessons}
              students={students}
              selectedStudent={selectedStudent}
              selectedPeriod={selectedPeriod}
              selectedDate={selectedDate}
              startDate={startDate}
              endDate={endDate}
            />

            <PdfReport
              lessons={lessons}
              students={students}
              selectedStudent={selectedStudent}
              selectedPeriod={selectedPeriod}
              totalHours={totalHours}
              totalEarnings={totalEarnings}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>

        <StudentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          student={editingStudent}
          studentColor={studentColor}
          setStudentColor={setStudentColor}
        />
      </div>
    </SidebarProvider>
  );
}