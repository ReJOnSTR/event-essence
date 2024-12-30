import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileBarChart } from "lucide-react";
import { Student } from "@/types/calendar";

interface ReportStats {
  weekly: number;
  monthly: number;
  yearly: number;
}

export default function Reports() {
  const [students] = useState<Student[]>(JSON.parse(localStorage.getItem('students') || '[]'));
  const [selectedStudent, setSelectedStudent] = useState<string>("all");

  // Mock data - replace with actual calculations
  const stats: ReportStats = {
    weekly: 12,
    monthly: 48,
    yearly: 576
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileBarChart className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold">Ders Raporları</h1>
        </div>
        
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Öğrenci Seç" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              <SelectItem value="all">Tüm Öğrenciler</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Ders Saati</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.weekly} saat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aylık Ders Saati</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.monthly} saat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yıllık Ders Saati</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.yearly} saat</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}