import { useStudents } from "@/hooks/useStudents";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StudentDialog from "@/components/Students/StudentDialog";
import StudentCard from "@/components/Students/StudentCard";

export default function StudentsPage() {
  const { students, isLoading } = useStudents();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Öğrenciler</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          Yeni Öğrenci Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      <StudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}