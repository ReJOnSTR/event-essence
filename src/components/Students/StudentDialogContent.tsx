import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMemo, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { SliderPicker } from 'react-color';
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
  isLoading?: boolean;
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
  isLoading = false,
}: StudentDialogContentProps) {
  const { toast } = useToast();
  const [localName, setLocalName] = useState(studentName);
  const [localPrice, setLocalPrice] = useState(studentPrice.toString());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalName(studentName);
    setLocalPrice(studentPrice.toString());
  }, [studentName, studentPrice]);

  const validateName = (value: string) => {
    if (!value.trim()) {
      return "İsim alanı zorunludur";
    }
    if (value.length < 2) {
      return "İsim en az 2 karakter olmalıdır";
    }
    if (value.length > 25) {
      return "İsim en fazla 25 karakter olabilir";
    }
    return "";
  };

  const validatePrice = (value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return "Geçerli bir fiyat giriniz";
    }
    if (numericValue < 0) {
      return "Fiyat 0'dan küçük olamaz";
    }
    if (numericValue > 999999.99) {
      return "Fiyat çok yüksek";
    }
    return "";
  };

  const debouncedNameChange = useMemo(
    () =>
      debounce((value: string) => {
        const error = validateName(value);
        if (!error) {
          setStudentName(value);
        }
        setErrors(prev => ({ ...prev, name: error }));
      }, 300),
    [setStudentName]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 25);
    setLocalName(value);
    debouncedNameChange(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalPrice(value);
    
    const error = validatePrice(value);
    setErrors(prev => ({ ...prev, price: error }));
    
    if (!error) {
      const numericValue = parseFloat(value);
      setStudentPrice(numericValue);
    }
  };

  const handleColorChange = (color: any) => {
    setStudentColor(color.hex);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">İsim</Label>
        <Input
          id="name"
          value={localName}
          onChange={handleNameChange}
          placeholder="Öğrenci adı"
          maxLength={25}
          required
          disabled={isLoading}
          className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <div className="flex justify-between text-xs">
          <span className={cn(
            "text-muted-foreground",
            errors.name && "text-destructive"
          )}>
            {localName.length}/25 karakter
          </span>
          {errors.name && (
            <span className="text-destructive" id="name-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Ders Ücreti (₺)</Label>
        <Input
          id="price"
          type="number"
          value={localPrice}
          onChange={handlePriceChange}
          placeholder="0"
          min="0"
          max="999999.99"
          step="0.01"
          required
          disabled={isLoading}
          className={cn(errors.price && "border-destructive focus-visible:ring-destructive")}
          aria-invalid={!!errors.price}
          aria-describedby={errors.price ? "price-error" : undefined}
        />
        {errors.price && (
          <p className="text-sm text-destructive" id="price-error" role="alert">
            {errors.price}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Renk</Label>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: studentColor }}
          />
          <span className="text-sm text-muted-foreground">Seçilen Renk</span>
        </div>
        <SliderPicker
          color={studentColor}
          onChange={handleColorChange}
        />
      </div>

      {student && onDelete && (
        <div className="absolute bottom-6 left-6">
          <Button
            variant="ghost"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Sil
          </Button>
        </div>
      )}
    </div>
  );
}