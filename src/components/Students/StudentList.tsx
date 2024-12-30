import { Plus, FileBarChart } from "lucide-react";
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

interface StudentListProps {
  students?: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  onAddStudent?: () => void;
}

export default function StudentList({ students = [], onEdit, onDelete, onAddStudent }: StudentListProps) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Öğrenciler</SidebarGroupLabel>
        <SidebarGroupContent className="border rounded-md p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onAddStudent}>
                <Plus className="h-4 w-4" />
                <span>Öğrenci Ekle</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <ScrollArea className="h-[200px]">
              {students.slice(0, 5).map((student) => (
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
              {students.length > 5 && (
                <div className="mt-2 border-t pt-2">
                  {students.slice(5).map((student) => (
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
                </div>
              )}
            </ScrollArea>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarMenuButton asChild className="w-full">
          <Link to="/reports" className="flex items-center gap-2 px-2">
            <FileBarChart className="h-4 w-4" />
            <span>Raporlar</span>
          </Link>
        </SidebarMenuButton>
      </SidebarGroup>
    </>
  );
}