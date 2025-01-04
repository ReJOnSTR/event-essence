import { Plus, FileBarChart, Settings, Calendar, Users, LogOut } from "lucide-react";
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
import { AuthButtons, LoginButton } from "@/components/Auth/AuthButtons";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";

interface SideMenuProps {
  onAddStudent?: () => void;
  onEdit?: (student: Student) => void;
}

export default function SideMenu({ 
  onAddStudent,
  onEdit,
}: SideMenuProps) {
  const { students } = useStudents();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", icon: Calendar, label: "Takvim" },
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

      {user && (
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-2">Öğrenciler</SidebarGroupLabel>
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
      )}

      <SidebarFooter className="mt-auto">
        {user ? (
          <div className="border-t pt-4 space-y-4">
            <div className="px-4">
              <div className="flex items-center space-x-4 bg-accent/50 p-4 rounded-lg">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary/5 text-primary/70">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Öğretmen
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-2 flex items-center gap-2">
              <Link to="/settings" className="flex-1">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  data-active={isActive("/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Ayarlar
                </Button>
              </Link>
              <AuthButtons />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <LoginButton />
          </div>
        )}
      </SidebarFooter>
    </div>
  );
}