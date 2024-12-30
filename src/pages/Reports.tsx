import { useState, useEffect } from "react";
import { FileBarChart, Filter, Calendar } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Student } from "@/types/calendar";
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

export default function Reports() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [hours, setHours] = useState({ weekly: 0, monthly: 0, yearly: 0 });
  const [students, setStudents] = useState<Student[]>(JSON.parse(localStorage.getItem('students') || '[]'));
  const { toast } = useToast();

  const calculateTotalHours = () => {
    const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let weeklyHours = 0;
    let monthlyHours = 0;
    let yearlyHours = 0;

    lessons.forEach((lesson: any) => {
      const lessonDate = new Date(lesson.start);
      const duration = (new Date(lesson.end).getTime() - new Date(lesson.start).getTime()) / (1000 * 60 * 60);

      if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
        if (lessonDate >= startOfWeek) {
          weeklyHours += duration;
        }
        if (lessonDate >= startOfMonth) {
          monthlyHours += duration;
        }
        if (lessonDate >= startOfYear) {
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
  }, [selectedStudent]);

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
            <h1 className="text-2xl font-semibold text-gray-900">Ders Raporları</h1>
            <div className="ml-auto">
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Takvime Dön
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-4 border-b bg-white sticky top-0 z-10">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <Select value={selectedPeriod} onValueChange={(value: "weekly" | "monthly" | "yearly") => setSelectedPeriod(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Periyot Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Haftalık</SelectItem>
                    <SelectItem value="monthly">Aylık</SelectItem>
                    <SelectItem value="yearly">Yıllık</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => {
                  toast({
                    title: "Filtreler sıfırlandı",
                    description: "Tüm filtreler varsayılan değerlere döndürüldü.",
                  });
                  setSelectedStudent("all");
                  setSelectedPeriod("weekly");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtreleri Sıfırla
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Haftalık Ders Saati</CardTitle>
                  <FileBarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hours.weekly} Saat</div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(), "'Hafta' w, MMMM yyyy", { locale: tr })}
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
                    {format(new Date(), "MMMM yyyy", { locale: tr })}
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
                    {format(new Date(), "yyyy", { locale: tr })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}