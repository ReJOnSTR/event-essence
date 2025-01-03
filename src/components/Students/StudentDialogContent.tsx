import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

const THEME_COLORS = [
  "#4F46E5", // Indigo
  "#0EA5E9", // Sky
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
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
        <div className="grid grid-cols-5 gap-2">
          {THEME_COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "w-full h-8 rounded-md border-2 transition-all",
                studentColor === color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-muted"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setStudentColor(color)}
              type="button"
            />
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-8",
                  !THEME_COLORS.includes(studentColor) && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ 
                  backgroundColor: !THEME_COLORS.includes(studentColor) ? studentColor : undefined 
                }}
              >
                <div className="w-full h-1 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label>Özel Renk Seç</Label>
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