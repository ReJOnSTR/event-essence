import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";

interface ReportFiltersProps {
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  selectedPeriod: "weekly" | "monthly" | "yearly" | "custom";
  setSelectedPeriod: (value: "weekly" | "monthly" | "yearly" | "custom") => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  students: Student[];
}

export function ReportFilters({
  selectedStudent,
  setSelectedStudent,
  selectedPeriod,
  setSelectedPeriod,
  selectedDate,
  setSelectedDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  students
}: ReportFiltersProps) {
  const { toast } = useToast();

  const resetFilters = () => {
    setSelectedStudent("");
    setSelectedPeriod("weekly");
    setSelectedDate(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    toast({
      title: "Filtreler sıfırlandı",
      description: "Tüm filtreler varsayılan değerlere döndürüldü.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          onValueChange={(value: "weekly" | "monthly" | "yearly" | "custom") => {
            setSelectedPeriod(value);
            if (value !== "custom") {
              setStartDate(undefined);
              setEndDate(undefined);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Periyot Seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Haftalık</SelectItem>
            <SelectItem value="monthly">Aylık</SelectItem>
            <SelectItem value="yearly">Yıllık</SelectItem>
            <SelectItem value="custom">Özel Tarih Aralığı</SelectItem>
          </SelectContent>
        </Select>

        {selectedPeriod === "custom" ? (
          <>
            <div>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Başlangıç Tarihi"
              />
            </div>
            <div>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="Bitiş Tarihi"
              />
            </div>
          </>
        ) : (
          <div className="md:col-span-2">
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              placeholder="Tarih Seçin"
            />
          </div>
        )}
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={resetFilters}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtreleri Sıfırla
      </Button>
    </div>
  );
}