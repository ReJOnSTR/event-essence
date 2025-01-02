import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";

interface StudentDialogContentProps {
  student?: Student;
  studentName: string;
  setStudentName: (name: string) => void;
  studentPrice: number;
  setStudentPrice: (price: number) => void;
  studentColor: string;
  setStudentColor: (color: string) => void;
  onDelete?: () => void;
}

const STUDENT_COLORS = [
  { value: "#1a73e8", label: "Calendar Blue" },
  { value: "#039be5", label: "Event Blue" },
  { value: "#1557b0", label: "Deep Blue" },
  { value: "#70757a", label: "Calendar Gray" },
  { value: "#3c4043", label: "Dark Gray" },
  { value: "#185abc", label: "Royal Blue" },
  { value: "#1967d2", label: "Bright Blue" },
  { value: "#4285f4", label: "Google Blue" },
];

export default function StudentDialogContent({
  student,
  studentName,
  setStudentName,
  studentPrice,
  setStudentPrice,
  studentColor,
  setStudentColor,
  onDelete,
}: StudentDialogContentProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>İsim</Label>
        <Input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Öğrenci adı"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Ders Ücreti (₺)</Label>
        <Input
          type="number"
          value={studentPrice}
          onChange={(e) => setStudentPrice(Number(e.target.value))}
          placeholder="0"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Renk</Label>
        <RadioGroup
          value={studentColor}
          onValueChange={setStudentColor}
          className="grid grid-cols-2 gap-2"
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
                className="flex items-center gap-2 rounded-md border-2 border-muted p-2 hover:bg-muted peer-data-[state=checked]:border-primary cursor-pointer w-full"
              >
                <div
                  className="h-4 w-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-sm">{color.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      {student && onDelete && (
        <div className="absolute bottom-6 left-6">
          <Button
            variant="ghost"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      )}
    </div>
  );
}