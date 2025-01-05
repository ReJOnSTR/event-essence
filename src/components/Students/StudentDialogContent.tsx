import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMemo, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const STUDENT_COLORS = [
  { value: "#4F46E5", label: "İndigo", className: "bg-indigo-600" },
  { value: "#0EA5E9", label: "Mavi", className: "bg-sky-500" },
  { value: "#10B981", label: "Yeşil", className: "bg-emerald-500" },
  { value: "#F59E0B", label: "Turuncu", className: "bg-amber-500" },
  { value: "#EC4899", label: "Pembe", className: "bg-pink-500" },
  { value: "#8B5CF6", label: "Mor", className: "bg-violet-500" },
];

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
  const [localPrice, setLocalPrice] = useState(studentPrice.toString());

  useEffect(() => {
    setLocalName(studentName);
    setLocalPrice(studentPrice.toString());
  }, [studentName, studentPrice]);

  const debouncedNameChange = useMemo(
    () =>
      debounce((value: string) => {
        if (value.length <= 25) {
          setStudentName(value);
        } else {
          toast({
            title: "Karakter Sınırı",
            description: "İsim en fazla 25 karakter olabilir.",
            variant: "destructive",
          });
        }
      }, 300),
    [setStudentName, toast]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 25);
    setLocalName(value);
    debouncedNameChange(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalPrice(value);
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 999999.99) {
      setStudentPrice(numericValue);
    } else if (value === '') {
      setStudentPrice(0);
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
          maxLength={25}
          required
        />
        <div className="text-xs text-muted-foreground">
          {localName.length}/25 karakter
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Ders Ücreti (₺)</Label>
        <Input
          type="number"
          value={localPrice}
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
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full ${color.className}`}
                />
                <span className="mt-2 text-xs">{color.label}</span>
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