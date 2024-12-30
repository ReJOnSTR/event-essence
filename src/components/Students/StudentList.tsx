import { UserPen, UserMinus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuAction
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudentListProps {
  students?: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  onAddStudent?: () => void;
}

export default function StudentList({ students = [], onEdit, onDelete, onAddStudent }: StudentListProps) {
  return (
    <SidebarGroup>
      <Link to="/students" className="block hover:bg-accent rounded-md transition-colors">
        <SidebarGroupLabel className="cursor-pointer">Öğrenciler</SidebarGroupLabel>
      </Link>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onAddStudent}>
              <Plus className="h-4 w-4" />
              <span>Öğrenci Ekle</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <ScrollArea className="h-[200px]">
            {students.map((student) => (
              <SidebarMenuItem key={student.id}>
                <SidebarMenuButton className="w-full">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: student.color }}
                  />
                  <span>{student.name}</span>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={() => onEdit?.(student)}
                  className="right-8"
                >
                  <UserPen className="h-4 w-4" />
                </SidebarMenuAction>
                <SidebarMenuAction
                  onClick={() => onDelete?.(student.id)}
                >
                  <UserMinus className="h-4 w-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </ScrollArea>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}