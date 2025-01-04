import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { PdfReport } from "@/components/Reports/PdfReport";
import { useReportData } from "@/hooks/useReportData";
import SideMenu from "@/components/Layout/SideMenu";
import { Student } from "@/types/calendar";
import StudentDialog from "@/components/Students/StudentDialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | "custom">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [studentColor, setStudentColor] = useState<string>("#000000");
  
  const { lessons, students, isLoading, error } = useReportData(
    selectedStudent,
    selectedPeriod,
    selectedDate,
    startDate,
    endDate
  );

  const { toast } = useToast();

  if (error) {
    toast({
      variant: "destructive",
      title: "Hata",
      description: "Veriler yüklenirken bir hata oluştu."
    });
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentName(student.name);
    setStudentPrice(student.price);
    setStudentColor(student.color || "#000000");
    setIsDialogOpen(true);
  };

  const handleSaveStudent = () => {
    setIsDialogOpen(false);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu 
              onAddStudent={() => {
                setEditingStudent(null);
                setStudentName("");
                setStudentPrice(0);
                setStudentColor("#000000");
                setIsDialogOpen(true);
              }}
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
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
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
                  lessons={lessons}
                  students={students}
                  selectedDate={selectedDate}
                  selectedStudent={selectedStudent}
                  startDate={startDate}
                  endDate={endDate}
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
                  selectedDate={selectedDate}
                  startDate={startDate}
                  endDate={endDate}
                />
              </>
            )}
          </div>
        </div>

        <StudentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveStudent}
          student={editingStudent || undefined}
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