import { useState, useEffect } from "react";
import { FileBarChart, Filter } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Reports() {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [hours, setHours] = useState({ weekly: 0, monthly: 0, yearly: 0 });
  const { toast } = useToast();

  const getStudents = (): Student[] => {
    return JSON.parse(localStorage.getItem('students') || '[]');
  };

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
    <div className="flex h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Ders Raporları</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Filtreler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Öğrenci Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Öğrenciler</SelectItem>
                    {getStudents().map((student) => (
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
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtreleri Sıfırla
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Haftalık Ders Saati</CardTitle>
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
  );
}