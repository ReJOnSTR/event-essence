import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, User } from "lucide-react";

interface StudentListProps {
  students: Student[];
  onAddStudent: () => void;
  onStudentClick: (student: Student) => void;
}

const StudentList = ({ students, onAddStudent, onStudentClick }: StudentListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Öğrenciler</h2>
        <Button variant="outline" size="sm" onClick={onAddStudent}>
          <Plus className="h-4 w-4 mr-2" />
          Ekle
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
        <div className="space-y-2">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => onStudentClick(student)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: student.color }}
              >
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{student.name}</div>
                {student.email && (
                  <div className="text-sm text-muted-foreground truncate">
                    {student.email}
                  </div>
                )}
              </div>
            </button>
          ))}
          {students.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Henüz öğrenci eklenmemiş</p>
              <Button
                variant="link"
                className="mt-2 text-sm"
                onClick={onAddStudent}
              >
                Öğrenci ekle
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StudentList;