import { PageHeader } from "@/components/Layout/PageHeader";
import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { PdfReport } from "@/components/Reports/PdfReport";
import { useStudents } from "@/hooks/useStudents";
import SideMenu from "@/components/Layout/SideMenu";

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | "custom">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const { students } = useStudents();

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
              hours={{
                weekly: 0,
                monthly: 0,
                yearly: 0,
                custom: startDate && endDate ? 0 : undefined
              }}
              earnings={{
                weekly: 0,
                monthly: 0,
                yearly: 0,
                custom: startDate && endDate ? 0 : undefined
              }}
              selectedDate={selectedDate}
              startDate={startDate}
              endDate={endDate}
              selectedPeriod={selectedPeriod}
            />
            
            <LessonList
              lessons={[]}
              students={students}
              selectedStudent={selectedStudent}
              selectedPeriod={selectedPeriod}
              selectedDate={selectedDate}
              startDate={startDate}
              endDate={endDate}
            />

            <PdfReport
              lessons={[]}
              students={students}
              selectedStudent={selectedStudent}
              selectedPeriod={selectedPeriod}
              totalHours={0}
              totalEarnings={0}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}