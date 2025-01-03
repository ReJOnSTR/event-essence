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
import { getFilteredLessons } from "@/utils/reportCalculations";

interface LessonListProps {
  lessons: Lesson[];
  students: Student[];
  selectedStudent: string;
  selectedPeriod: "weekly" | "monthly" | "yearly";
  selectedDate: Date;
}

export function LessonList({
  lessons,
  students,
  selectedStudent,
  selectedPeriod,
  selectedDate,
}: LessonListProps) {
  const filteredLessons = getFilteredLessons(lessons, selectedDate, selectedStudent, selectedPeriod);

  const getStudentName = (studentId: string | undefined) => {
    if (!studentId) return "Öğrenci Seçilmedi";
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : "Öğrenci Bulunamadı";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            <TableHead>Saat</TableHead>
            <TableHead>Öğrenci</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLessons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Bu dönemde ders bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            filteredLessons.map((lesson) => {
              const start = new Date(lesson.start);
              const end = new Date(lesson.end);

              return (
                <TableRow key={lesson.id}>
                  <TableCell>
                    {format(start, "d MMMM yyyy", { locale: tr })}
                  </TableCell>
                  <TableCell>
                    {format(start, "HH:mm")} - {format(end, "HH:mm")}
                  </TableCell>
                  <TableCell>{getStudentName(lesson.studentId)}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}