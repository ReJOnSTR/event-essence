import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion, AnimatePresence } from "framer-motion";

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

  // Update filtered results whenever search term, lessons, or students change
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
        format(lesson.start, "d MMMM yyyy", { locale: tr })
          .toLowerCase()
          .includes(searchTermLower) ||
        student?.name.toLowerCase().includes(searchTermLower)
      );
    });

    // Filter students
    const matchingStudents = students.filter((student) =>
      student.name.toLowerCase().includes(searchTermLower)
    );

    setFilteredLessons(matchingLessons);
    setFilteredStudents(matchingStudents);
  }, [searchTerm, lessons, students]);

  const handleSelectDate = (date: Date) => {
    onSelectDate(date);
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
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-2 hover:bg-accent rounded-md cursor-pointer"
                            onClick={() => handleSelectDate(lesson.start)}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{lesson.title}</span>
                                <div className="flex items-center text-sm text-muted-foreground gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(lesson.start, "HH:mm")}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(lesson.start, "d MMMM yyyy", { locale: tr })}
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