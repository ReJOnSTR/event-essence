import { Student } from "@/types/calendar";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ReportsProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
}

export default function Reports({ students, onAddStudent, onEditStudent }: ReportsProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (students.length === 0) {
      toast({
        title: "No students found",
        description: "Please add students to generate reports.",
      });
    }
  }, [students, toast]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <Button onClick={onAddStudent} className="mt-4">
        Add Student
      </Button>
      <div className="mt-4">
        {students.length > 0 ? (
          <ul>
            {students.map((student) => (
              <li key={student.id} className="flex justify-between items-center p-2 border-b">
                <span>{student.name}</span>
                <Button variant="outline" onClick={() => onEditStudent(student)}>
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No students available.</p>
        )}
      </div>
    </div>
  );
}
