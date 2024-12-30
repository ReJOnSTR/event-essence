import { Button } from "@/components/ui/button";
import { Plus, Settings, User } from "lucide-react";
import { Student } from "@/types/calendar";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface StudentListProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
}

export default function StudentList({ students, onAddStudent, onEditStudent }: StudentListProps) {
  return (
    <>
      <SidebarGroup>
        <div className="flex items-center justify-between">
          <SidebarGroupLabel>Öğrenciler</SidebarGroupLabel>
          <Button variant="ghost" size="icon" onClick={onAddStudent} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
            {students.map((student) => (
              <SidebarMenuItem key={student.id}>
                <SidebarMenuButton
                  onClick={() => onEditStudent(student)}
                  className="w-full justify-start gap-2"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: student.color }}
                  />
                  {student.name}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Öğretmen</div>
              <div className="text-xs text-gray-500">Profil</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}