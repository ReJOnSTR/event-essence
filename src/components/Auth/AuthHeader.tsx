import { useRef, useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format, isFuture, compareAsc } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import { SearchPanel } from "@/components/Search/SearchPanel";

interface AuthHeaderProps {
  onHeightChange?: (height: number) => void;
  children?: ReactNode;
}

function AuthHeader({ onHeightChange, children }: AuthHeaderProps) {
  const [notifications] = useState(2);
  const headerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredLessons, setFilteredLessons] = useState<CalendarEvent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<CalendarEvent[]>(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

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
        lesson.title?.toLowerCase().includes(searchTermLower) ||
        lesson.description?.toLowerCase().includes(searchTermLower) ||
        format(new Date(lesson.start), "d MMMM yyyy")
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

  useEffect(() => {
    const handleStorageChange = () => {
      const savedLessons = localStorage.getItem('lessons');
      const savedStudents = localStorage.getItem('students');
      
      if (savedLessons) {
        setLessons(JSON.parse(savedLessons));
      }
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSelectDate = (date: Date) => {
    navigate('/calendar', { state: { selectedDate: date } });
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleStudentClick = (student: Student) => {
    navigate('/students');
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <>
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
      </div>

      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        filteredLessons={filteredLessons}
        filteredStudents={filteredStudents}
        students={students}
        onSelectDate={handleSelectDate}
        onStudentClick={handleStudentClick}
      />
    </>
  );
}

export default AuthHeader;