import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import StudentDialogContent from "./StudentDialogContent";

interface StudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  student?: Student;
  studentName: string;
  setStudentName: (name: string) => void;
  studentPrice: number;
  setStudentPrice: (price: number) => void;
  studentColor: string;
  setStudentColor: (color: string) => void;
}

export default function StudentDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  student,
  studentName,
  setStudentName,
  studentPrice,
  setStudentPrice,
  studentColor,
  setStudentColor,
}: StudentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {student ? "Öğrenci Düzenle" : "Öğrenci Ekle"}
          </DialogTitle>
          <DialogDescription>
            Öğrenci bilgilerini buradan ekleyebilir veya düzenleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        
        <StudentDialogContent
          student={student}
          studentName={studentName}
          setStudentName={setStudentName}
          studentPrice={studentPrice}
          setStudentPrice={setStudentPrice}
          studentColor={studentColor}
          setStudentColor={setStudentColor}
          onDelete={onDelete}
        />

        <DialogFooter className="flex items-center justify-end mt-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={onSave}>
              {student ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}