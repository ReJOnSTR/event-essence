import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Repeat, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

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
  const getRecurrencePreview = () => {
    if (recurrenceType === "none") return "";
    
    const intervalText = recurrenceInterval > 1 ? `${recurrenceInterval} ` : "";
    const typeText = {
      daily: "gün",
      weekly: "hafta",
      monthly: "ay"
    }[recurrenceType];
    
    return `${intervalText}${typeText} arayla ${recurrenceCount} kez tekrarlanacak`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Repeat className="h-5 w-5 text-muted-foreground" />
        <Label className="text-base">Tekrar Sıklığı</Label>
      </div>

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

      {recurrenceType !== "none" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tekrar Aralığı</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={recurrenceInterval}
                  onChange={(e) => onRecurrenceIntervalChange(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">
                  {recurrenceType === "daily" && "gün"}
                  {recurrenceType === "weekly" && "hafta"}
                  {recurrenceType === "monthly" && "ay"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tekrar Sayısı</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={recurrenceCount}
                  onChange={(e) => onRecurrenceCountChange(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">kez</span>
              </div>
            </div>
          </div>

          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {getRecurrencePreview()}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}