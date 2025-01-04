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
import { motion } from "framer-motion";

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

const filterVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

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
    <motion.div 
      className="space-y-4"
      variants={filterVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {selectedPeriod === "custom" ? (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Başlangıç Tarihi"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="Bitiş Tarihi"
              />
            </motion.div>
          </>
        ) : (
          <motion.div
            className="sm:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
            />
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button 
            variant="outline" 
            className="w-full hover:bg-accent/50 transition-all duration-200"
            onClick={resetFilters}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreleri Sıfırla
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}