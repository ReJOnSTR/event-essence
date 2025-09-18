import { Plus, FileBarChart, Calendar, Users, X, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useStudents } from "@/hooks/useStudents";
import { useStudentStore } from "@/store/studentStore";
import { SearchResults } from "@/components/Search/SearchResults";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isFuture, compareAsc } from "date-fns";
import { useSessionContext } from '@supabase/auth-helpers-react';
import LoginRequiredDialog from "@/components/Auth/LoginRequiredDialog";
import { useLessons } from "@/hooks/useLessons";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SideMenuProps {
  searchTerm: string;
}

export default function SideMenu({ searchTerm }: SideMenuProps) {
  const { students } = useStudents();
  const { lessons } = useLessons();
  const location = useLocation();
  const navigate = useNavigate();
  const { openDialog, setSelectedStudent } = useStudentStore();
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { session } = useSessionContext();
  const { setOpen } = useSidebar();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleAddStudent = () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    openDialog();
  };

  const handleDateSelect = (date: Date) => {
    navigate('/calendar', { state: { selectedDate: date } });
  };

  // Update search results when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLessons([]);
      setFilteredStudents([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Filter lessons
    const matchingLessons = lessons?.filter((lesson) => {
      const student = students?.find((s) => s.id === lesson.studentId);
      const lessonDate = new Date(lesson.start);
      
      return (
        lesson.title?.toLowerCase().includes(searchTermLower) ||
        lesson.description?.toLowerCase().includes(searchTermLower) ||
        format(lessonDate, "d MMMM yyyy")
          .toLowerCase()
          .includes(searchTermLower) ||
        student?.name.toLowerCase().includes(searchTermLower)
      );
    }) || [];

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
    const matchingStudents = students?.filter((student) =>
      student.name.toLowerCase().includes(searchTermLower)
    ) || [];

    setFilteredLessons(sortedLessons);
    setFilteredStudents(matchingStudents);
  }, [searchTerm, lessons, students]);

  const menuItems = [
    { path: "/calendar", icon: Calendar, label: "Takvim" },
    { path: "/students", icon: Users, label: "Öğrenciler" },
    { path: "/reports", icon: FileBarChart, label: "Raporlar" },
  ];

  return (
    <div className="flex flex-col h-full bg-background w-full">
      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Menü</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Main Navigation */}
      <div className="px-2 py-4">
        <SidebarGroup className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => isMobile && setOpen(false)}
              className="block"
            >
              <SidebarMenuButton 
                className={cn(
                  "w-full hover:bg-accent rounded-lg transition-all duration-200",
                  isActive(item.path) && "bg-accent text-accent-foreground font-medium"
                )}
                data-active={isActive(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarGroup>
      </div>

      <Separator className="mx-4" />

      {/* Students Section */}
      <div className="px-2 py-4 flex-1 flex flex-col overflow-hidden">
        <SidebarGroup className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide">
              Öğrenciler
            </SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddStudent}
              className="h-6 w-6 hover:bg-accent"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <SidebarGroupContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <SidebarMenu className="space-y-1">
                {students?.map((student) => (
                  <SidebarMenuItem key={student.id}>
                    <SidebarMenuButton 
                      onClick={() => {
                        handleStudentClick(student);
                        isMobile && setOpen(false);
                      }}
                      className="w-full hover:bg-accent rounded-lg transition-all duration-200 group"
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full ring-2 ring-background"
                        style={{ backgroundColor: student.color }}
                      />
                      <span className="truncate flex-1 text-left">
                        {student.name}
                      </span>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        ₺{student.price}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                {(!students || students.length === 0) && (
                  <div className="px-3 py-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Henüz öğrenci eklenmemiş
                    </p>
                    <Button
                      onClick={handleAddStudent}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      İlk Öğrenciyi Ekle
                    </Button>
                  </div>
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="border-t px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide px-2 mb-2">
              Arama Sonuçları ({filteredLessons.length + filteredStudents.length})
            </SidebarGroupLabel>
            <SidebarGroupContent className="max-h-48 overflow-y-auto">
              <SearchResults
                searchTerm={searchTerm}
                filteredLessons={filteredLessons}
                filteredStudents={filteredStudents}
                students={students || []}
                onStudentClick={(student) => {
                  handleStudentClick(student);
                  isMobile && setOpen(false);
                }}
                onDateSelect={(date) => {
                  handleDateSelect(date);
                  isMobile && setOpen(false);
                }}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      )}

      <LoginRequiredDialog 
        isOpen={isLoginDialogOpen} 
        onClose={() => setIsLoginDialogOpen(false)} 
      />
    </div>
  );
}