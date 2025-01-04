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

interface LessonListProps {
  lessons: Lesson[];
  students: Student[];
  selectedStudent: string;
  selectedPeriod: "weekly" | "monthly" | "yearly" | "custom";
  selectedDate: Date;
  startDate?: Date;
  endDate?: Date;
}

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
    <div className="rounded-md border">
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
          {filteredLessons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Bu dönemde ders bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            filteredLessons.map((lesson) => {
              const start = new Date(lesson.start);
              const end = new Date(lesson.end);
              const fee = getLessonFee(lesson.studentId);

              return (
                <TableRow key={lesson.id}>
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
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}