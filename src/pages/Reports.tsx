import { useState } from "react";
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
  const { toast } = useToast();

  // Bu fonksiyon mock veri döndürüyor, gerçek uygulamada veritabanından gelecek
  const getStudents = (): Student[] => {
    return JSON.parse(localStorage.getItem('students') || '[]');
  };

  const calculateTotalHours = () => {
    // Mock veri - gerçek uygulamada veritabanından hesaplanacak
    return {
      weekly: 12,
      monthly: 48,
      yearly: 576
    };
  };

  const hours = calculateTotalHours();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Ders Raporları</h1>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-[200px]">
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
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Periyot Seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Haftalık</SelectItem>
            <SelectItem value="monthly">Aylık</SelectItem>
            <SelectItem value="yearly">Yıllık</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => {
          toast({
            title: "Filtreler sıfırlandı",
            description: "Tüm filtreler varsayılan değerlere döndürüldü.",
          });
          setSelectedStudent("all");
          setSelectedPeriod("weekly");
        }}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
  );
}