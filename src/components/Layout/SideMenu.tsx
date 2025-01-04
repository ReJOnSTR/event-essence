import { Plus, FileBarChart, Settings, Calendar, Users } from "lucide-react";
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
import { motion } from "framer-motion";

interface SideMenuProps {
  onAddStudent?: () => void;
  onEdit?: (student: Student) => void;
  headerHeight?: number;
}

export default function SideMenu({ 
  onAddStudent,
  onEdit,
  headerHeight = 0
}: SideMenuProps) {
  const { students } = useStudents();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", icon: Calendar, label: "Takvim" },
    { path: "/students", icon: Users, label: "Öğrenciler" },
    { path: "/reports", icon: FileBarChart, label: "Raporlar" },
  ];

  return (
    <motion.div 
      className="flex flex-col h-full bg-background"
      initial={false}
      animate={{ 
        marginTop: headerHeight 
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {/* Main Navigation Menu */}
      <div className="flex flex-col h-full">
        <SidebarGroup className="p-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="block mb-1"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', item.path);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
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

        {/* Students Section */}
        <SidebarGroup className="px-2 flex-1">
          <SidebarGroupLabel>Öğrenciler</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onAddStudent}
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
                      onClick={() => onEdit?.(student)}
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

        {/* Footer */}
        <SidebarFooter>
          <div className="border-t p-2">
            <div className="flex items-center justify-between">
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
                  className="hover:bg-secondary"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </SidebarFooter>
      </div>
    </motion.div>
  );
}