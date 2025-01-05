import { useState } from "react";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { PdfReport } from "@/components/Reports/PdfReport";
import { useStudents } from "@/hooks/useStudents";
import { useLessons } from "@/hooks/useLessons";
import { PageHeader } from "@/components/Layout/PageHeader";

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | "custom">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  const { students = [] } = useStudents();
  const { lessons = [] } = useLessons();

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
    </div>
  );
}