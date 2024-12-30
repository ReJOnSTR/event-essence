import { Plus } from "lucide-react";
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
import { Link } from "react-router-dom";

interface StudentListProps {
  students?: Student[];
  onEditStudent?: (student: Student) => void;
  onAddStudent?: () => void;
}

export default function StudentList({ 
  students = [], 
  onEditStudent, 
  onAddStudent 
}: StudentListProps) {
  return (
    <>
      <SidebarGroup>
        <Link to="/students" className="block hover:bg-accent rounded-md transition-colors">
          <SidebarGroupLabel className="cursor-pointer">Öğrenciler</SidebarGroupLabel>
        </Link>
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
                  <SidebarMenuButton 
                    className="w-full"
                    onClick={() => onEditStudent?.(student)}
                  >
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
                      <SidebarMenuButton 
                        className="w-full"
                        onClick={() => onEditStudent?.(student)}
                      >
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
    </>
  );
}