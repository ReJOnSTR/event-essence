import { Student } from "@/types/calendar";
import { Card, CardContent } from "@/components/ui/card";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <Card 
      className="flex flex-col cursor-pointer transition-all hover:ring-2 hover:ring-primary"
      onClick={() => onClick(student)}
    >
      <CardContent className="flex-1 p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-semibold"
            style={{ backgroundColor: student.color }}
          >
            {student.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{student.name}</h3>
            <p className="text-sm text-gray-500">
              Ders Ücreti: {student.price} ₺
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}