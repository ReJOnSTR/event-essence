import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Users, Pencil, Trash2 } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  return (
    <SidebarMenu>
      {students.map((student) => (
        <SidebarMenuItem key={student.id}>
          <SidebarMenuButton className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{student.name}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(student)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(student.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}