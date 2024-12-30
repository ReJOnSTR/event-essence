import { Plus, FileBarChart, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

interface StudentListProps {
  students?: Student[];
  onAddStudent?: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

export default function StudentList({ 
  students = [], 
  onAddStudent,
  onEdit,
  onDelete 
}: StudentListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <SidebarGroup>
        <div 
          onClick={() => navigate('/students')} 
          className="block hover:bg-accent rounded-md transition-colors cursor-pointer"
        >
          <SidebarGroupLabel className="cursor-pointer">Öğrenciler</SidebarGroupLabel>
        </div>
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

      <div className="mt-auto">
        <div 
          onClick={() => navigate('/reports')}
          className="block hover:bg-accent rounded-md transition-colors mb-4 cursor-pointer"
        >
          <SidebarMenuButton className="w-full">
            <FileBarChart className="h-4 w-4" />
            <span>Raporlar</span>
          </SidebarMenuButton>
        </div>

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
              <div onClick={() => navigate('/settings')} className="cursor-pointer">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </div>
    </div>
  );
}