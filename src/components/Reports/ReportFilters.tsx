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
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ReportFiltersProps {
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  selectedPeriod: "weekly" | "monthly" | "yearly" | "custom";
  setSelectedPeriod: (value: "weekly" | "monthly" | "yearly" | "custom") => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
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
  const isMobile = useIsMobile();

  const resetFilters = () => {
    setSelectedStudent("all");
    setSelectedPeriod("weekly");
    setSelectedDate(new Date());
    setStartDate(undefined);
    setEndDate(undefined);
    toast({
      title: "Filtreler sıfırlandı",
      description: "Tüm filtreler varsayılan değerlere döndürüldü.",
    });
  };

  return (
    <div className="space-y-4">
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
      )}>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className={cn(
            isMobile && "h-10 text-sm"
          )}>
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
          <SelectTrigger className={cn(
            isMobile && "h-10 text-sm"
          )}>
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
            <DatePicker
              date={startDate}
              setDate={setStartDate}
              placeholder="Başlangıç Tarihi"
              className={cn(
                isMobile && "h-10 text-sm"
              )}
            />
            <DatePicker
              date={endDate}
              setDate={setEndDate}
              placeholder="Bitiş Tarihi"
              className={cn(
                isMobile && "h-10 text-sm"
              )}
            />
          </>
        ) : (
          <div className={isMobile ? "w-full" : "md:col-span-2"}>
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              className={cn(
                isMobile && "h-10 text-sm w-full"
              )}
            />
          </div>
        )}
      </div>

      <Button 
        variant="outline" 
        className={cn(
          "w-full",
          isMobile && "h-10 text-sm"
        )}
        onClick={resetFilters}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtreleri Sıfırla
      </Button>
    </div>
  );
}
