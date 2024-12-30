import { Student } from "@/types/calendar";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface StudentListProps {
  students?: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link to="/students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Öğrenciler</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {students?.map((student) => (
        <SidebarMenuItem key={student.id}>
          <SidebarMenuButton
            className="flex items-center gap-2"
            onClick={() => onEdit?.(student)}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: student.color }}
            />
            <span>{student.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}