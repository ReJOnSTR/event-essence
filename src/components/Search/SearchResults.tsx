import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Student, CalendarEvent } from "@/types/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResultsProps {
  searchTerm: string;
  filteredLessons: CalendarEvent[];
  filteredStudents: Student[];
  students: Student[];
  onStudentClick: (student: Student) => void;
  onDateSelect: (date: Date) => void;
}

export function SearchResults({
  searchTerm,
  filteredLessons,
  filteredStudents,
  students,
  onStudentClick,
  onDateSelect,
}: SearchResultsProps) {
  if (!searchTerm) return null;

  return (
    <ScrollArea className="h-[300px] rounded-md p-2">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="space-y-4"
        >
          {filteredStudents.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Öğrenciler
              </h3>
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => onStudentClick(student)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: student.color }}
                    />
                    <span>{student.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {filteredLessons.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dersler
              </h3>
              {filteredLessons.map((lesson) => {
                const student = students.find((s) => s.id === lesson.studentId);
                const lessonDate = new Date(lesson.start);
                
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => onDateSelect(lessonDate)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{lesson.title}</span>
                        <div className="flex items-center text-sm text-muted-foreground gap-1">
                          <Clock className="h-3 w-3" />
                          {format(lessonDate, "HH:mm")}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(lessonDate, "d MMMM yyyy", { locale: tr })}
                      </div>
                      {student && (
                        <div className="flex items-center gap-2 text-sm">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: student.color }}
                          />
                          <span>{student.name}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          {filteredStudents.length === 0 && filteredLessons.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Sonuç bulunamadı
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </ScrollArea>
  );
}