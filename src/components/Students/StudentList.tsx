import { Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/types/calendar";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface StudentListProps {
  students?: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  onAddClick?: () => void;
}

export default function StudentList({ students = [], onEdit, onDelete, onAddClick }: StudentListProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Öğrenciler</SidebarGroupLabel>
      <Button 
        onClick={onAddClick} 
        variant="outline" 
        className="w-full mb-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Öğrenci Ekle
      </Button>
      <ScrollArea className="h-[200px]">
        <SidebarMenu>
          {students.map((student) => (
            <SidebarMenuItem key={student.id}>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 w-full">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: student.color }}
                  />
                  <span>{student.name}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </ScrollArea>
    </SidebarGroup>
  );
}