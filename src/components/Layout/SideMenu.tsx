import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { LogOut, Settings, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface SideMenuProps {
  onAddStudent?: () => void;
  onEdit?: (student: any) => void;
}

export default function SideMenu({ onAddStudent, onEdit }: SideMenuProps) {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: students } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (students) {
        setStudents(students);
      }
    };

    fetchStudents();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <SidebarContent>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link to="/students">
                <Button
                  variant={isActive("/students") ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Öğrenciler
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Öğrencilerim
            </h2>
            <div className="space-y-1">
              {students.map((student) => (
                <Button
                  key={student.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => onEdit?.(student)}
                >
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: student.color || "#4338ca" }}
                  />
                  {student.name}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={onAddStudent}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Yeni Öğrenci
              </Button>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        {user ? (
          <div className="border-t">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4 bg-card p-3 rounded-lg shadow-sm">
                <Avatar className="h-10 w-10 ring-2 ring-background">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Öğretmen
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Link to="/settings" className="w-full">
                  <Button 
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      isActive("/settings") && "bg-accent"
                    )}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Ayarlar
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </SidebarFooter>
    </>
  );
}
