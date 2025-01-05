import { useRef, useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  User,
  LogIn,
  UserPlus,
  Settings,
  HelpCircle,
  Calendar,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, isFuture, compareAsc } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion, AnimatePresence } from "framer-motion";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
  children?: ReactNode;
}

export function AuthHeader({ onHeightChange, children }: AuthHeaderProps) {
  const [notifications] = useState(2);
  const headerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredLessons, setFilteredLessons] = useState<CalendarEvent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  // Mock data - gerçek uygulamada bu veriler props olarak gelmeli
  const [lessons] = useState<CalendarEvent[]>([]);
  const [students] = useState<Student[]>([]);

  useEffect(() => {
    onHeightChange?.(64);
  }, [onHeightChange]);

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

    // Sort lessons
    const sortedLessons = [...matchingLessons].sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      
      if (isFuture(dateA) && isFuture(dateB)) {
        return compareAsc(dateA, dateB);
      }
      if (isFuture(dateA)) return -1;
      if (isFuture(dateB)) return 1;
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
    navigate('/calendar', { state: { selectedDate: date } });
    setIsSearchOpen(false);
  };

  const handleStudentClick = (student: Student) => {
    navigate('/students');
    setIsSearchOpen(false);
  };

  return (
    <div
      ref={headerRef}
      className="w-full bg-background border-b fixed top-0 left-0 right-0 z-50 shadow-sm"
    >
      <div className="h-16 px-4 flex items-center justify-between max-w-[2000px] mx-auto">
        <div className="flex items-center space-x-4">
          {children}
          <h1 className="text-xl font-semibold">EventEssence</h1>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Ders, öğrenci veya tarih ara..."
              className="w-full pl-10 bg-muted/30 border-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to="/settings" className="w-full">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Ayarlar</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Hesap</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="gap-2">
                <LogIn className="h-4 w-4" />
                <span>Giriş Yap</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Kayıt Ol</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Yardım</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
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
    </div>
  );
}