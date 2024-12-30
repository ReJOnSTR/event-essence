import { Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";

interface StudentListProps {
  students?: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  onAddStudent?: () => void;
}

export default function StudentList({ students = [], onEdit, onDelete, onAddStudent }: StudentListProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Öğrenciler</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Öğrenciler Sayfası</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {onAddStudent && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onAddStudent}>
                <Plus className="h-4 w-4" />
                <span>Öğrenci Ekle</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

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
              </SidebarMenuItem>
            ))}
          </ScrollArea>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}