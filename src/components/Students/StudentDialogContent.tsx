import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";

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
        <div className="grid grid-cols-4 gap-2">
          {THEME_COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "w-full aspect-square rounded-md border-2 transition-all hover:scale-105",
                studentColor === color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-muted"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setStudentColor(color)}
              type="button"
            />
          ))}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-2 h-10",
                !THEME_COLORS.includes(studentColor) && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <div 
                  className="w-6 h-6 rounded-md border border-muted"
                  style={{ backgroundColor: studentColor }}
                />
                <span>Özel Renk Seç</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <Label>Özel Renk Seç</Label>
              <HexColorPicker 
                color={studentColor} 
                onChange={setStudentColor}
                style={{ width: '100%', height: '160px' }}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={studentColor.toUpperCase()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                      setStudentColor(value);
                    }
                  }}
                  className="font-mono uppercase"
                  maxLength={7}
                />
                <div 
                  className="w-10 h-10 rounded-md border-2 border-muted"
                  style={{ backgroundColor: studentColor }}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
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