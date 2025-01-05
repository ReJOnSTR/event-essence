import { Plus, FileBarChart, Calendar, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudents } from "@/hooks/useStudents";
import { useStudentStore } from "@/store/studentStore";
import { SearchResults } from "@/components/Search/SearchResults";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isFuture, compareAsc } from "date-fns";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

interface SideMenuProps {
  searchTerm: string;
}

export default function SideMenu({ searchTerm }: SideMenuProps) {
  const { students } = useStudents();
  const location = useLocation();
  const navigate = useNavigate();
  const { openDialog, setSelectedStudent } = useStudentStore();
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { session } = useSessionContext();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleStudentClick = (student: Student) => {
    if (!session) {
      toast({
        title: "Erişim Engellendi",
        description: "Bu özelliği kullanmak için giriş yapmalısınız.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setSelectedStudent(student);
  };

  const handleAddStudent = () => {
    if (!session) {
      toast({
        title: "Erişim Engellendi",
        description: "Bu özelliği kullanmak için giriş yapmalısınız.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    openDialog();
  };

  const handleDateSelect = (date: Date) => {
    navigate('/calendar', { state: { selectedDate: date } });
  };

  // Get lessons from localStorage
  const [lessons, setLessons] = useState(() => {
    const savedLessons = localStorage.getItem('lessons');
    return savedLessons ? JSON.parse(savedLessons) : [];
  });

  // Update search results when searchTerm changes
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

  const menuItems = [
    { path: "/calendar", icon: Calendar, label: "Takvim" },
    { path: "/students", icon: Users, label: "Öğrenciler", requiresAuth: true },
    { path: "/reports", icon: FileBarChart, label: "Raporlar", requiresAuth: true },
  ];

  return (
    <div className="flex flex-col h-full bg-background w-full">
      <SidebarGroup className="space-y-2">
        {menuItems.map((item) => {
          if (item.requiresAuth && !session) {
            return (
              <SidebarMenuButton 
                key={item.path}
                className="w-full hover:bg-secondary/50 rounded-md transition-colors opacity-50 cursor-not-allowed"
                onClick={() => {
                  toast({
                    title: "Erişim Engellendi",
                    description: "Bu sayfaya erişmek için giriş yapmalısınız.",
                    variant: "destructive"
                  });
                  navigate('/login');
                }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            );
          }
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="block"
            >
              <SidebarMenuButton 
                className="w-full hover:bg-secondary rounded-md transition-colors"
                data-active={isActive(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          );
        })}
      </SidebarGroup>

      {session && (
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-2">Öğrenciler</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleAddStudent}
                  className="w-full hover:bg-secondary rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Öğrenci Ekle</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <ScrollArea className="h-[200px] px-1">
                {students.map((student) => (
                  <SidebarMenuItem key={student.id}>
                    <SidebarMenuButton 
                      onClick={() => handleStudentClick(student)}
                      className="w-full hover:bg-secondary rounded-md transition-colors group"
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: student.color }}
                      />
                      <span className="truncate group-hover:text-secondary-foreground">
                        {student.name}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </ScrollArea>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {searchTerm && (
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-2">Arama Sonuçları</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SearchResults
              searchTerm={searchTerm}
              filteredLessons={filteredLessons}
              filteredStudents={filteredStudents}
              students={students}
              onStudentClick={handleStudentClick}
              onDateSelect={handleDateSelect}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </div>
  );
}