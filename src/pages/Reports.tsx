import { useState, useEffect } from "react";
import { FileBarChart, Filter, Calendar, ArrowLeft } from "lucide-react";
import { format, startOfWeek, startOfMonth, startOfYear, isWithinInterval } from "date-fns";
import { tr } from 'date-fns/locale';
import { Student, Lesson } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import StudentList from "@/components/Students/StudentList";
import { DatePicker } from "@/components/ui/date-picker";

export default function Reports() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hours, setHours] = useState({ weekly: 0, monthly: 0, yearly: 0 });
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });
  const { toast } = useToast();

  const calculateTotalHours = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const monthStart = startOfMonth(selectedDate);
    const yearStart = startOfYear(selectedDate);

    let weeklyHours = 0;
    let monthlyHours = 0;
    let yearlyHours = 0;

    lessons.forEach((lesson) => {
      const lessonStart = new Date(lesson.start);
      const lessonEnd = new Date(lesson.end);
      const duration = (lessonEnd.getTime() - lessonStart.getTime()) / (1000 * 60 * 60);

      if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
        // Weekly calculation
        if (isWithinInterval(lessonStart, { start: weekStart, end: selectedDate })) {
          weeklyHours += duration;
        }
        // Monthly calculation
        if (isWithinInterval(lessonStart, { start: monthStart, end: selectedDate })) {
          monthlyHours += duration;
        }
        // Yearly calculation
        if (isWithinInterval(lessonStart, { start: yearStart, end: selectedDate })) {
          yearlyHours += duration;
        }
      }
    });

    setHours({
      weekly: Math.round(weeklyHours),
      monthly: Math.round(monthlyHours),
      yearly: Math.round(yearlyHours)
    });
  };

  useEffect(() => {
    calculateTotalHours();
  }, [selectedStudent, selectedPeriod, lessons, selectedDate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <Sidebar>
          <SidebarContent className="p-4">
            <StudentList
              students={students}
              onEdit={() => {}}
              onDelete={() => {}}
              onAddStudent={() => {}}
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Öğrenci Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Öğrenciler</SelectItem>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={selectedPeriod} 
                      onValueChange={(value: "weekly" | "monthly" | "yearly") => setSelectedPeriod(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Periyot Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Haftalık</SelectItem>
                        <SelectItem value="monthly">Aylık</SelectItem>
                        <SelectItem value="yearly">Yıllık</SelectItem>
                      </SelectContent>
                    </Select>

                    <DatePicker
                      date={selectedDate}
                      setDate={setSelectedDate}
                    />
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Filtreler sıfırlandı",
                        description: "Tüm filtreler varsayılan değerlere döndürüldü.",
                      });
                      setSelectedStudent("all");
                      setSelectedPeriod("weekly");
                      setSelectedDate(new Date());
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtreleri Sıfırla
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Haftalık Ders Saati</CardTitle>
                    <FileBarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hours.weekly} Saat</div>
                    <p className="text-xs text-muted-foreground">
                      {format(selectedDate, "'Hafta' w, MMMM yyyy", { locale: tr })}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aylık Ders Saati</CardTitle>
                    <FileBarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hours.monthly} Saat</div>
                    <p className="text-xs text-muted-foreground">
                      {format(selectedDate, "MMMM yyyy", { locale: tr })}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Yıllık Ders Saati</CardTitle>
                    <FileBarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hours.yearly} Saat</div>
                    <p className="text-xs text-muted-foreground">
                      {format(selectedDate, "yyyy", { locale: tr })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}