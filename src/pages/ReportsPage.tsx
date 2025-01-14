import { useState } from "react";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { PdfReport } from "@/components/Reports/PdfReport";
import { useStudents } from "@/hooks/useStudents";
import { useLessons } from "@/hooks/useLessons";
import { Student } from "@/types/calendar";
import StudentDialog from "@/components/Students/StudentDialog";
import { PageHeader } from "@/components/Layout/PageHeader";

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
  
  const { students = [] } = useStudents();
  const { lessons = [] } = useLessons();

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
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader title="Raporlar" />

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
  );
}