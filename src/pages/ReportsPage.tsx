import { PageHeader } from "@/components/Layout/PageHeader";
import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import ReportFilters from "@/components/Reports/ReportFilters";
import StatsCards from "@/components/Reports/StatsCards";
import LessonList from "@/components/Reports/LessonList";
import { PdfReport } from "@/components/Reports/PdfReport";
import { useStudents } from "@/hooks/useStudents";
import SideMenu from "@/components/Layout/SideMenu";

export default function ReportsPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
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
            actions={
              <PdfReport
                startDate={startDate}
                endDate={endDate}
                selectedStudentId={selectedStudentId}
                students={students}
              />
            }
          />

          <div className="p-4 space-y-4">
            <ReportFilters
              startDate={startDate}
              endDate={endDate}
              selectedStudentId={selectedStudentId}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onStudentChange={setSelectedStudentId}
            />
            
            <StatsCards
              startDate={startDate}
              endDate={endDate}
              selectedStudentId={selectedStudentId}
            />
            
            <LessonList
              startDate={startDate}
              endDate={endDate}
              selectedStudentId={selectedStudentId}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}