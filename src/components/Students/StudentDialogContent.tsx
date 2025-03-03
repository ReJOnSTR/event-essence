import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMemo, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { SliderPicker } from 'react-color';

interface StudentDialogContentProps {
  student?: Student;
  studentName: string;
  setStudentName: (name: string) => void;
  studentPrice: number;
  setStudentPrice: (price: number) => void;
  studentColor: string;
  setStudentColor: (color: string) => void;
  onDelete?: () => void;
  isSaving?: boolean;
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
  isSaving = false,
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

  const handleColorChange = (color: any) => {
    setStudentColor(color.hex);
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
          disabled={isSaving}
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
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label>Renk</Label>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: studentColor }}
          />
          <span className="text-sm text-muted-foreground">Seçilen Renk</span>
        </div>
        <SliderPicker
          color={studentColor}
          onChange={handleColorChange}
          disabled={isSaving}
        />
      </div>

      {student && onDelete && (
        <div className="absolute bottom-6 left-6">
          <Button
            variant="ghost"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      )}
    </div>
  );
}
