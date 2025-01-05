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

  const handleStudentClick = (student: Student) => {
    try {
      const event = new CustomEvent('editStudent', { 
        detail: student,
        bubbles: true,
        cancelable: true 
      });
      document.dispatchEvent(event);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Öğrenci düzenleme işlemi başlatılamadı.",
        variant: "destructive"
      });
    }
  };

  const handleAddStudent = () => {
    try {
      const event = new CustomEvent('addStudent', {
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Öğrenci ekleme işlemi başlatılamadı.",
        variant: "destructive"
      });
    }
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
    </div>
  );
}