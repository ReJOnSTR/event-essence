import { Student } from "@/types/calendar";
import StudentList from "@/components/Students/StudentList";

interface StudentsProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
}

export default function Students({ students, onAddStudent, onEditStudent }: StudentsProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Öğrenci Listesi</h1>
      <StudentList
        students={students}
        onAddStudent={onAddStudent}
        onEditStudent={onEditStudent}
      />
    </div>
  );
}
