import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface StudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  student?: Student;
  studentName: string;
  setStudentName: (name: string) => void;
  studentEmail: string;
  setStudentEmail: (email: string) => void;
  studentPhone: string;
  setStudentPhone: (phone: string) => void;
}

export default function StudentDialog({
  isOpen,
  onClose,
  onSave,
  student,
  studentName,
  setStudentName,
  studentEmail,
  setStudentEmail,
  studentPhone,
  setStudentPhone,
}: StudentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {student ? "Öğrenci Düzenle" : "Öğrenci Ekle"}
          </DialogTitle>
          <DialogDescription>
            Öğrenci bilgilerini buradan ekleyebilir veya düzenleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">İsim</label>
            <Input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Öğrenci adı"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">E-posta</label>
            <Input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="ornek@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefon</label>
            <Input
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={onSave}>
            {student ? "Güncelle" : "Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}