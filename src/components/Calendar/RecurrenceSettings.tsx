import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface RecurrenceSettingsProps {
  recurrenceType: "none" | "daily" | "weekly" | "monthly";
  recurrenceCount: number;
  recurrenceInterval: number;
  onRecurrenceTypeChange: (value: "none" | "daily" | "weekly" | "monthly") => void;
  onRecurrenceCountChange: (count: number) => void;
  onRecurrenceIntervalChange: (interval: number) => void;
}

export default function RecurrenceSettings({
  recurrenceType,
  recurrenceCount,
  recurrenceInterval,
  onRecurrenceTypeChange,
  onRecurrenceCountChange,
  onRecurrenceIntervalChange,
}: RecurrenceSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tekrar Sıklığı</Label>
        <Select value={recurrenceType} onValueChange={onRecurrenceTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tekrar sıklığını seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tekrar Etme</SelectItem>
            <SelectItem value="daily">Günlük</SelectItem>
            <SelectItem value="weekly">Haftalık</SelectItem>
            <SelectItem value="monthly">Aylık</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recurrenceType !== "none" && (
        <>
          <div className="space-y-2">
            <Label>Tekrar Aralığı</Label>
            <Input
              type="number"
              min={1}
              max={99}
              value={recurrenceInterval}
              onChange={(e) => onRecurrenceIntervalChange(parseInt(e.target.value) || 1)}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground">
              {recurrenceType === "daily" && "gün"}
              {recurrenceType === "weekly" && "hafta"}
              {recurrenceType === "monthly" && "ay"}
              {" aralıklarla tekrar et"}
            </span>
          </div>

          <div className="space-y-2">
            <Label>Tekrar Sayısı</Label>
            <Input
              type="number"
              min={1}
              max={99}
              value={recurrenceCount}
              onChange={(e) => onRecurrenceCountChange(parseInt(e.target.value) || 1)}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground">
              Toplam {recurrenceCount} kez tekrarlanacak
            </span>
          </div>
        </>
      )}
    </div>
  );
}