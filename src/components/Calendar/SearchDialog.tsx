import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, User, Clock } from "lucide-react";
import { format, isFuture, compareAsc } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  lessons: CalendarEvent[];
  students: Student[];
}

export default function SearchDialog({
  isOpen,
  onClose,
  onSelectDate,
  lessons,
  students,
}: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLessons, setFilteredLessons] = useState<CalendarEvent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm) {
      setFilteredLessons([]);
      setFilteredStudents([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Filter lessons
    const matchingLessons = lessons.filter((lesson) => {
      const student = students.find((s) => s.id === lesson.studentId);
      return (
        lesson.title.toLowerCase().includes(searchTermLower) ||
        lesson.description?.toLowerCase().includes(searchTermLower) ||
        format(new Date(lesson.start), "d MMMM yyyy", { locale: tr })
          .toLowerCase()
          .includes(searchTermLower) ||
        student?.name.toLowerCase().includes(searchTermLower)
      );
    });

    // Sort lessons by date (closest first)
    const sortedLessons = [...matchingLessons].sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      const now = new Date();

      // If both dates are in the future, sort by closest first
      if (isFuture(dateA) && isFuture(dateB)) {
        return compareAsc(dateA, dateB);
      }
      
      // If only one date is in the future, prioritize it
      if (isFuture(dateA)) return -1;
      if (isFuture(dateB)) return 1;
      
      // For past dates, sort by most recent first
      return compareAsc(dateB, dateA);
    });

    // Filter students
    const matchingStudents = students.filter((student) =>
      student.name.toLowerCase().includes(searchTermLower)
    );

    setFilteredLessons(sortedLessons);
    setFilteredStudents(matchingStudents);
  }, [searchTerm, lessons, students]);

  const handleSelectDate = (date: Date) => {
    onSelectDate(new Date(date));
    onClose();
  };

  const handleStudentClick = (student: Student) => {
    navigate('/students');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ara</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ders, öğrenci veya tarih ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-2">
            <AnimatePresence mode="wait">
              {searchTerm && (
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
                          onClick={() => handleStudentClick(student)}
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
                        const isFutureLesson = isFuture(lessonDate);
                        
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-2 hover:bg-accent rounded-md cursor-pointer ${
                              isFutureLesson ? 'border-l-2 border-green-500' : ''
                            }`}
                            onClick={() => handleSelectDate(lesson.start)}
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
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}