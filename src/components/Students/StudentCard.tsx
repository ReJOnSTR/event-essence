import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{student.name}</h3>
      <p className="text-sm text-gray-500">Fiyat: {student.price}₺</p>
      <div className="mt-2">
        <Button onClick={() => onClick(student)}>Düzenle</Button>
      </div>
    </div>
  );
}