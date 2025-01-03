import { Plus, FileBarChart, Settings, Calendar, Users, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/hooks/useStudents";
import { useToast } from "@/components/ui/use-toast";

interface SharedSideMenuProps {
  onAddStudent?: () => void;
  onEdit?: (student: Student) => void;
}

export default function SharedSideMenu({ 
  onAddStudent,
  onEdit,
}: SharedSideMenuProps) {
  const { students, deleteStudent } = useStudents();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", icon: Calendar, label: "Takvim" },
    { path: "/students", icon: Users, label: "Öğrenciler" },
    { path: "/reports", icon: FileBarChart, label: "Raporlar" },
  ];

  const handleDeleteStudent = (student: Student) => {
    if (confirm(`${student.name} isimli öğrenciyi silmek istediğinize emin misiniz?`)) {
      deleteStudent(student.id);
      toast({
        title: "Öğrenci silindi",
        description: "Öğrenci başarıyla silindi.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SidebarGroup className="space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className="block"
          >
            <SidebarMenuButton 
              className="w-full hover:bg-accent rounded-md transition-colors"
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
                onClick={onAddStudent}
                className="w-full hover:bg-accent rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Öğrenci Ekle</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <ScrollArea className="h-[200px] px-1">
              {students.map((student) => (
                <SidebarMenuItem key={student.id}>
                  <div className="flex items-center justify-between w-full px-2 py-1 hover:bg-accent rounded-md group">
                    <SidebarMenuButton 
                      onClick={() => onEdit?.(student)}
                      className="flex-1"
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: student.color }}
                      />
                      <span className="truncate group-hover:text-accent-foreground">
                        {student.name}
                      </span>
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteStudent(student)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </SidebarMenuItem>
              ))}
            </ScrollArea>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter className="mt-auto">
        <div className="border-t pt-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <Link to="/settings">
              <Button 
                variant="ghost" 
                size="icon"
                data-active={isActive("/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </div>
  );
}