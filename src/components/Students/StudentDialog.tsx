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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  studentColor: string;
  setStudentColor: (color: string) => void;
}

const STUDENT_COLORS = [
  { value: "#9b87f5", label: "Mor" },
  { value: "#F97316", label: "Turuncu" },
  { value: "#0EA5E9", label: "Mavi" },
  { value: "#D946EF", label: "Pembe" },
  { value: "#33C3F0", label: "Açık Mavi" },
  { value: "#FEC6A1", label: "Şeftali" },
];

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
  studentColor,
  setStudentColor,
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Renk</label>
            <RadioGroup
              value={studentColor}
              onValueChange={setStudentColor}
              className="grid grid-cols-3 gap-2"
            >
              {STUDENT_COLORS.map((color) => (
                <div key={color.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={color.value}
                    id={color.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={color.value}
                    className="flex items-center gap-2 rounded-md border-2 border-muted p-2 hover:bg-muted peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-sm">{color.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
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