import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface RecurrenceSettingsProps {
  recurrenceType: "none" | "daily" | "weekly" | "monthly";
  recurrenceEndDate: Date | null;
  recurrenceInterval: number;
  onRecurrenceTypeChange: (value: "none" | "daily" | "weekly" | "monthly") => void;
  onRecurrenceEndDateChange: (date: Date | null) => void;
  onRecurrenceIntervalChange: (interval: number) => void;
}

export default function RecurrenceSettings({
  recurrenceType,
  recurrenceEndDate,
  recurrenceInterval,
  onRecurrenceTypeChange,
  onRecurrenceEndDateChange,
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
            <Label>Bitiş Tarihi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {recurrenceEndDate ? (
                    format(recurrenceEndDate, "PPP", { locale: tr })
                  ) : (
                    <span>Tarih seçin</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={recurrenceEndDate || undefined}
                  onSelect={onRecurrenceEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
}