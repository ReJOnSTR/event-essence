import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Plus, UserCog } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";

interface SharedSideMenuProps {
  onEdit: (student: Student) => void;
  onAddStudent: () => void;
}

export function SharedSideMenu({ onEdit, onAddStudent }: SharedSideMenuProps) {
  const { students } = useStudents();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Öğrenciler</h2>
        <Button variant="outline" size="sm" onClick={onAddStudent}>
          <Plus className="h-4 w-4 mr-2" />
          Öğrenci Ekle
        </Button>
      </div>
      
      <div className="space-y-2">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-2 rounded-lg border bg-white"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: student.color }}
              />
              <span>{student.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(student)}
            >
              <UserCog className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SharedSideMenu;