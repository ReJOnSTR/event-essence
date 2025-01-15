import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/calendar";

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
}

export default function StudentCard({ student, onEdit }: StudentCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.price} TL/saat</p>
        </div>
        <Button variant="outline" onClick={() => onEdit(student)}>
          Düzenle
        </Button>
      </div>
    </Card>
  );
}