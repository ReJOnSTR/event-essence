import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/types/calendar";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

interface StudentListProps {
  students?: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Öğrenciler</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Öğrenciler</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}