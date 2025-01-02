import { Plus, FileBarChart, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/hooks/useStudents";

interface StudentListProps {
  onAddStudent?: () => void;
  onEdit?: (student: Student) => void;
}

export default function StudentList({ 
  onAddStudent,
  onEdit,
}: StudentListProps) {
  const { students } = useStudents();

  return (
    <div className="flex flex-col h-full">
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
              {students.map((student) => (
                <SidebarMenuItem key={student.id}>
                  <SidebarMenuButton 
                    className="w-full"
                    onClick={() => onEdit?.(student)}
                  >
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

      <div className="mt-auto">
        <Link to="/reports" className="block hover:bg-accent rounded-md transition-colors mb-4">
          <SidebarMenuButton className="w-full">
            <FileBarChart className="h-4 w-4" />
            <span>Raporlar</span>
          </SidebarMenuButton>
        </Link>

        <SidebarFooter>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Admin</span>
              </div>
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </SidebarFooter>
      </div>
    </div>
  );
}