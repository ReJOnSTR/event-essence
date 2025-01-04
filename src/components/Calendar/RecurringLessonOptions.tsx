import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RecurringLessonOptionsProps {
  isRecurring: boolean;
  recurrenceType: string;
  recurrenceCount: number;
  onRecurringChange: (value: boolean) => void;
  onRecurrenceTypeChange: (value: string) => void;
  onRecurrenceCountChange: (value: number) => void;
}

export default function RecurringLessonOptions({
  isRecurring,
  recurrenceType,
  recurrenceCount,
  onRecurringChange,
  onRecurrenceTypeChange,
  onRecurrenceCountChange,
}: RecurringLessonOptionsProps) {
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => onRecurringChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isRecurring">Tekrarlayan Ders</Label>
      </div>

      {isRecurring && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tekrar Sıklığı</Label>
            <Select
              value={recurrenceType}
              onValueChange={onRecurrenceTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tekrar sıklığı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Haftalık</SelectItem>
                <SelectItem value="monthly">Aylık</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tekrar Sayısı</Label>
            <Input
              type="number"
              min={1}
              max={52}
              value={recurrenceCount}
              onChange={(e) => onRecurrenceCountChange(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}