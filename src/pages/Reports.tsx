import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Student, Lesson } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import StudentList from "@/components/Students/StudentList";
import { ReportFilters } from "@/components/Reports/ReportFilters";
import { StatsCards } from "@/components/Reports/StatsCards";
import { LessonList } from "@/components/Reports/LessonList";
import { calculatePeriodHours } from "@/utils/reportCalculations";

interface ReportsProps {
  students: Student[];
  onAddStudent: () => void;
}

const Reports = ({ students, onAddStudent }: ReportsProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });

  const hours = calculatePeriodHours(lessons, selectedDate, selectedStudent);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <StudentList
              students={students}
              onEdit={() => {}}
              onDelete={() => {}}
              onAddStudent={onAddStudent}
            />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <SidebarTrigger />
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Takvime Dön</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Raporlar</h1>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Filtreler</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportFilters
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    students={students}
                  />
                </CardContent>
              </Card>

              <StatsCards hours={hours} selectedDate={selectedDate} />

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Ders Listesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <LessonList
                    lessons={lessons}
                    students={students}
                    selectedStudent={selectedStudent}
                    selectedPeriod={selectedPeriod}
                    selectedDate={selectedDate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
