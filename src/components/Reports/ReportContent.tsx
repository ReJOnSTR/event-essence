import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFilters } from "./ReportFilters";
import { StatsCards } from "./StatsCards";
import { LessonList } from "./LessonList";
import { useStudents } from "@/hooks/useStudents";
import { calculatePeriodHours, calculatePeriodEarnings } from "@/utils/reportCalculations";

export function ReportContent() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | "custom">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { students } = useStudents();
  
  const lessons = (() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  })();

  const hours = calculatePeriodHours(lessons, selectedDate, selectedStudent, startDate, endDate);
  const earnings = calculatePeriodEarnings(lessons, selectedDate, selectedStudent, students, startDate, endDate);

  return (
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
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              students={students}
            />
          </CardContent>
        </Card>

        <StatsCards 
          hours={hours} 
          earnings={earnings}
          selectedDate={selectedDate}
          startDate={startDate}
          endDate={endDate}
          selectedPeriod={selectedPeriod}
        />

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
              startDate={startDate}
              endDate={endDate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}