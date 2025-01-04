import { PageHeader } from "@/components/Layout/PageHeader";
import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { PdfReport } from "@/components/Reports/PdfReport";
import { useStudents } from "@/hooks/useStudents";
import { useLessons } from "@/hooks/useLessons";
import SideMenu from "@/components/Layout/SideMenu";
import { calculatePeriodHours, calculatePeriodEarnings } from "@/utils/reportCalculations";

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | "custom">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  const { students } = useStudents();
  const { lessons } = useLessons();

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarContent className="p-4">
            <SideMenu />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <PageHeader
            title="Raporlar"
            backTo="/"
            backLabel="Takvime Dön"
          />

          <div className="p-4 space-y-4">
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
      </div>
    </SidebarProvider>
  );
}