import { Pin, Plus } from "lucide-react";
import { Student } from "@/types/calendar";
import { 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onAddStudent: () => void;
}

export default function StudentList({ students, onEdit, onDelete, onAddStudent }: StudentListProps) {
  const { setOpen } = useSidebar();

  const handlePinClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SidebarGroupLabel className="cursor-pointer">Öğrenciler</SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePinClick}
          className="h-6 w-6"
        >
          <Pin className="h-4 w-4" />
        </Button>
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
    </div>
  );
}