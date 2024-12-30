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
import { format } from "date-fns";

interface ReportFiltersProps {
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  students: Student[];
}

export function ReportFilters({
  selectedStudent,
  setSelectedStudent,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  students
}: ReportFiltersProps) {
  const { toast } = useToast();

  const resetFilters = () => {
    setSelectedStudent("all");
    setStartDate(new Date());
    setEndDate(new Date());
    toast({
      title: "Filtreler sıfırlandı",
      description: "Tüm filtreler varsayılan değerlere döndürüldü.",
    });
  };

  return (
    <div className="space-y-4">
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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Başlangıç Tarihi</label>
          <DatePicker
            date={startDate}
            setDate={setStartDate}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Bitiş Tarihi</label>
          <DatePicker
            date={endDate}
            setDate={setEndDate}
          />
        </div>
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