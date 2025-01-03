import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMemo, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { ChromePicker } from 'react-color';
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
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    setLocalName(studentName);
  }, [studentName]);

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
        />
        <div className="text-xs text-muted-foreground">
          {localName.length}/25 karakter
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
        <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={(e) => {
                e.preventDefault();
                setIsColorPickerOpen(true);
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: studentColor }}
                />
                <span>Renk Seç</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-3 border-none shadow-lg" 
            onInteractOutside={(e) => {
              e.preventDefault();
              setIsColorPickerOpen(false);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ChromePicker
              color={studentColor}
              onChange={handleColorChange}
              disableAlpha={true}
            />
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