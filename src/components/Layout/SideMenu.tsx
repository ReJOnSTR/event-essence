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
import { useToast } from "@/components/ui/use-toast";

export default function SideMenu() {
  const { students } = useStudents();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isStudentsPage = location.pathname === "/students";

  const handleStudentClick = (student: Student) => {
    if (!isStudentsPage) {
      toast({
        title: "Uyarı",
        description: "Öğrenci düzenlemek için öğrenciler sayfasına gidin.",
        variant: "destructive"
      });
      return;
    }
    window.dispatchEvent(new CustomEvent('editStudent', { detail: student }));
  };

  const handleAddStudent = () => {
    if (!isStudentsPage) {
      toast({
        title: "Uyarı",
        description: "Öğrenci eklemek için öğrenciler sayfasına gidin.",
        variant: "destructive"
      });
      return;
    }
    window.dispatchEvent(new CustomEvent('addStudent'));
  };

  const menuItems = [
    { path: "/calendar", icon: Calendar, label: "Takvim" },
    { path: "/students", icon: Users, label: "Öğrenciler" },
    { path: "/reports", icon: FileBarChart, label: "Raporlar" },
  ];

  return (
    <div className="flex flex-col h-full bg-background w-full">
      <SidebarGroup className="space-y-2">
        {menuItems.map((item) => (
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
        ))}
      </SidebarGroup>

      <SidebarGroup className="mt-6">
        <SidebarGroupLabel className="px-2">Öğrenciler</SidebarGroupLabel>
        <SidebarGroupContent className="mt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleAddStudent}
                className={`w-full rounded-md transition-colors ${
                  isStudentsPage 
                    ? "hover:bg-secondary cursor-pointer" 
                    : "opacity-50 cursor-not-allowed"
                }`}
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
                    className={`w-full rounded-md transition-colors group ${
                      isStudentsPage 
                        ? "hover:bg-secondary cursor-pointer" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
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
    </div>
  );
}