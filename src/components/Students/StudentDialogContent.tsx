import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  { value: "#4F46E5", label: "İndigo" },
  { value: "#0EA5E9", label: "Mavi" },
  { value: "#10B981", label: "Yeşil" },
  { value: "#F59E0B", label: "Turuncu" },
  { value: "#EF4444", label: "Kırmızı" },
  { value: "#8B5CF6", label: "Mor" },
  { value: "#EC4899", label: "Pembe" },
  { value: "#6B7280", label: "Gri" },
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
        <div className="grid grid-cols-2 gap-2">
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <div
                  className="h-4 w-4 rounded-full border border-gray-200 mr-2"
                  style={{ backgroundColor: studentColor }}
                />
                <span>Özel Renk</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label>Renk Seçici</Label>
                <Input
                  type="color"
                  value={studentColor}
                  onChange={(e) => setStudentColor(e.target.value)}
                  className="h-32 w-full"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
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