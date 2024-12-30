import { Plus, FileBarChart, Settings } from "lucide-react";
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
  onAddStudent?: () => void;
  onStudentClick?: (student: Student) => void;
}

export default function StudentList({ 
  students = [], 
  onAddStudent,
  onStudentClick 
}: StudentListProps) {
  return (
    <>
      <SidebarGroup>
        <Link to="/students" className="block hover:bg-accent rounded-md transition-colors">
          <SidebarGroupLabel className="cursor-pointer">Öğrenciler</SidebarGroupLabel>
        </Link>
        <SidebarGroupContent className="border rounded-md p-2">
          <SidebarMenu>
            {onAddStudent && (
              <SidebarMenuItem>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={onAddStudent}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Öğrenci Ekle</span>
                </Button>
              </SidebarMenuItem>
            )}

            <ScrollArea className="h-[200px]">
              {students.slice(0, 5).map((student) => (
                <SidebarMenuItem key={student.id}>
                  <SidebarMenuButton 
                    className="w-full cursor-pointer hover:bg-accent"
                    onClick={() => onStudentClick?.(student)}
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
                        className="w-full cursor-pointer hover:bg-accent"
                        onClick={() => onStudentClick?.(student)}
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

      <SidebarGroup>
        <Link to="/reports" className="block hover:bg-accent rounded-md transition-colors">
          <SidebarMenuButton className="w-full">
            <FileBarChart className="h-4 w-4" />
            <span>Raporlar</span>
          </SidebarMenuButton>
        </Link>
      </SidebarGroup>

      <div className="mt-auto">
        <SidebarGroup>
          <Link to="/settings" className="block hover:bg-accent rounded-md transition-colors ml-auto">
            <SidebarMenuButton className="w-full justify-end">
              <Settings className="h-4 w-4" />
            </SidebarMenuButton>
          </Link>
        </SidebarGroup>
      </div>
    </>
  );
}