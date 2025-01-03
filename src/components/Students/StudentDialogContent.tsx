import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useMemo, useState, useEffect } from "react";
import debounce from "lodash/debounce";

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
  { value: "#4F46E5", label: "İndigo" },
  { value: "#039be5", label: "Event Blue" },
  { value: "#0EA5E9", label: "Mavi" },
  { value: "#1557b0", label: "Deep Blue" },
  { value: "#10B981", label: "Yeşil" },
  { value: "#70757a", label: "Calendar Gray" },
  { value: "#F59E0B", label: "Turuncu" },
  { value: "#3c4043", label: "Dark Gray" },
  { value: "#EF4444", label: "Kırmızı" },
  { value: "#185abc", label: "Royal Blue" },
  { value: "#8B5CF6", label: "Mor" },
  { value: "#1967d2", label: "Bright Blue" },
  { value: "#EC4899", label: "Pembe" },
  { value: "#4285f4", label: "Google Blue" },
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
  const { toast } = useToast();
  const [localName, setLocalName] = useState(studentName);

  useEffect(() => {
    setLocalName(studentName);
  }, [studentName]);

  const debouncedNameChange = useMemo(
    () =>
      debounce((value: string) => {
        if (value.length <= 50) {
          setStudentName(value);
        } else {
          toast({
            title: "Karakter Sınırı",
            description: "İsim en fazla 50 karakter olabilir.",
            variant: "destructive",
          });
        }
      }, 300),
    [setStudentName, toast]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 50);
    setLocalName(value);
    debouncedNameChange(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 999999.99) {
      setStudentPrice(value);
    } else {
      toast({
        title: "Geçersiz Ücret",
        description: "Ücret 0 ile 999,999.99₺ arasında olmalıdır.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>İsim</Label>
        <Input
          value={localName}
          onChange={handleNameChange}
          placeholder="Öğrenci adı"
          maxLength={50}
          required
        />
        <div className="text-xs text-muted-foreground">
          {localName.length}/50 karakter
        </div>
      </div>
      <div className="space-y-2">
        <Label>Ders Ücreti (₺)</Label>
        <Input
          type="number"
          value={studentPrice}
          onChange={handlePriceChange}
          placeholder="0"
          min="0"
          max="999999.99"
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
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                {color.label}
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