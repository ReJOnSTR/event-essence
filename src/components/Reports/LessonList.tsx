import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Student, Lesson } from "@/types/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFilteredLessons } from "@/utils/reportCalculations";
import { motion, AnimatePresence } from "framer-motion";

interface LessonListProps {
  lessons: Lesson[];
  students: Student[];
  selectedStudent: string;
  selectedPeriod: "weekly" | "monthly" | "yearly" | "custom";
  selectedDate: Date;
  startDate?: Date;
  endDate?: Date;
}

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  }
};

export function LessonList({
  lessons,
  students,
  selectedStudent,
  selectedPeriod,
  selectedDate,
  startDate,
  endDate,
}: LessonListProps) {
  const filteredLessons = useFilteredLessons(
    lessons, 
    selectedDate, 
    selectedStudent, 
    selectedPeriod,
    startDate && endDate ? { start: startDate, end: endDate } : undefined
  );

  const getStudentName = (studentId: string | undefined) => {
    if (!studentId) return "Öğrenci Seçilmedi";
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : "Öğrenci Bulunamadı";
  };

  const getLessonFee = (studentId: string | undefined) => {
    if (!studentId) return 0;
    const student = students.find((s) => s.id === studentId);
    return student ? student.price : 0;
  };

  return (
    <motion.div 
      className="rounded-md border"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            <TableHead>Saat</TableHead>
            <TableHead>Öğrenci</TableHead>
            <TableHead className="text-right">Ücret</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="wait">
            {filteredLessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    Bu dönemde ders bulunamadı
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLessons.map((lesson) => {
                const start = new Date(lesson.start);
                const end = new Date(lesson.end);
                const fee = getLessonFee(lesson.studentId);

                return (
                  <motion.tr
                    key={lesson.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <TableCell>
                      {format(start, "d MMMM yyyy", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      {format(start, "HH:mm")} - {format(end, "HH:mm")}
                    </TableCell>
                    <TableCell>{getStudentName(lesson.studentId)}</TableCell>
                    <TableCell className="text-right">
                      {fee.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  );
}