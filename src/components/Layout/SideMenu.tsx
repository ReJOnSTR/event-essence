import { Plus, FileBarChart, Calendar, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarSubMenu, 
  SidebarSubMenuItem 
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
    // Öğrenci düzenleme modalını açmak için bir event yayınlayalım
    window.dispatchEvent(new CustomEvent('editStudent', { detail: student }));
  };

  const handleAddStudent = () => {
    // Yeni öğrenci ekleme modalını açmak için bir event yayınlayalım
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

      <SidebarSubMenu
        icon={<Users className="h-4 w-4" />}
        title="Öğrenciler"
        action={
          <button
            onClick={handleAddStudent}
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            <Plus className="h-4 w-4" />
          </button>
        }
      >
        {students.length === 0 ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Henüz öğrenci yok
          </div>
        ) : (
          students.map((student) => (
            <SidebarSubMenuItem
              key={student.id}
              onClick={() => handleStudentClick(student)}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: student.color }}
                />
                <span>{student.name}</span>
              </div>
            </SidebarSubMenuItem>
          ))
        )}
      </SidebarSubMenu>
    </SidebarMenu>
  );
}