import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Student, CalendarEvent } from "@/types/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface SearchResultsProps {
  searchTerm: string;
  filteredLessons: CalendarEvent[];
  filteredStudents: Student[];
  students: Student[];
  onStudentClick: (student: Student) => void;
  onDateSelect: (date: Date) => void;
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    x: -50,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    x: -50,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

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
    <ScrollArea className="h-[300px] rounded-md">
      <AnimatePresence mode="wait">
        <div className="space-y-4 p-2">
          {filteredStudents.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Öğrenciler
              </h3>
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Card
                      className="p-3 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => onStudentClick(student)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: student.color }}
                        />
                        <span>{student.name}</span>
                        <ArrowLeft className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {filteredLessons.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Dersler
              </h3>
              <div className="space-y-2">
                {filteredLessons.map((lesson) => {
                  const student = students.find((s) => s.id === lesson.student_id);
                  const lessonDate = new Date(lesson.start);
                  
                  return (
                    <motion.div
                      key={lesson.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <Card
                        className="p-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onDateSelect(lessonDate)}
                      >
                        <div className="space-y-2">
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
                              <ArrowLeft className="h-3 w-3 ml-auto text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
          {filteredStudents.length === 0 && filteredLessons.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-8"
            >
              Sonuç bulunamadı
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </ScrollArea>
  );
}
