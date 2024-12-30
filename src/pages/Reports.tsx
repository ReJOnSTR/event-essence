import { useState, useEffect } from "react";
import { Student, Lesson } from "@/types/calendar";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import StudentList from "@/components/Students/StudentList";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { calculateTotalHours } from "@/utils/reportCalculations";

interface ReportsProps {
  students: Student[];
  onAddStudent: () => void;
}

export default function Reports({ students, onAddStudent }: ReportsProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });

  const totalHours = calculateTotalHours(lessons, startDate, endDate, selectedStudent);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <StudentList
              students={students}
              onAddStudent={onAddStudent}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Raporlar</h2>
              <p className="text-muted-foreground">
                Seçilen tarih aralığında ders raporlarını görüntüleyin.
              </p>
            </div>

            <ReportFilters
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              students={students}
            />

            <StatsCards
              hours={totalHours}
              startDate={startDate}
              endDate={endDate}
            />

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium">Ders Listesi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Seçilen tarih aralığındaki tüm dersler
                </p>
                <LessonList
                  lessons={lessons}
                  students={students}
                  selectedStudent={selectedStudent}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}