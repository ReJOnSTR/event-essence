import { Plus, FileBarChart, Calendar, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
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
    window.dispatchEvent(new CustomEvent('editStudent', { detail: student }));
  };

  const handleAddStudent = () => {
    window.dispatchEvent(new CustomEvent('addStudent'));
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          to="/"
          className={`flex items-center space-x-2 ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Takvim</span>
        </Link>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <Link
          to="/reports"
          className={`flex items-center space-x-2 ${
            isActive("/reports") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <FileBarChart className="h-4 w-4" />
          <span>Raporlar</span>
        </Link>
      </SidebarMenuItem>

      <SidebarGroup>
        <SidebarGroupLabel className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Öğrenciler</span>
          </div>
          <button
            onClick={handleAddStudent}
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            <Plus className="h-4 w-4" />
          </button>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          {students.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              Henüz öğrenci yok
            </div>
          ) : (
            students.map((student) => (
              <SidebarMenuItem
                key={student.id}
                onClick={() => handleStudentClick(student)}
                className="cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: student.color }}
                  />
                  <span>{student.name}</span>
                </div>
              </SidebarMenuItem>
            ))
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarMenu>
  );
}