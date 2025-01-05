import { CalendarEvent, Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";
import { getDefaultLessonDuration } from "@/utils/settings";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { TimePicker } from "./TimePicker";

interface LessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<CalendarEvent, "id">) => void;
  onDelete?: (lessonId: string) => void;
  selectedDate: Date;
  event?: CalendarEvent;
  events: CalendarEvent[];
  students?: Student[];
}

export default function LessonDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  selectedDate, 
  event,
  events,
  students 
}: LessonDialogProps) {
  const { toast } = useToast();
  const [startTime, setStartTime] = useState(selectedDate);
  const [endTime, setEndTime] = useState(() => {
    const end = new Date(selectedDate);
    end.setMinutes(end.getMinutes() + getDefaultLessonDuration());
    return end;
  });
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>(event?.studentId);

  const validateForm = () => {
    if (!selectedStudent) {
      toast({
        title: "Öğrenci Seçilmedi",
        description: "Lütfen bir öğrenci seçin.",
        variant: "destructive"
      });
      return false;
    }

    if (startTime >= endTime) {
      toast({
        title: "Geçersiz Zaman Aralığı",
        description: "Ders bitiş saati başlangıç saatinden sonra olmalıdır.",
        variant: "destructive"
      });
      return false;
    }

    const duration = differenceInMinutes(endTime, startTime);
    if (duration < 30) {
      toast({
        title: "Geçersiz Ders Süresi",
        description: "Ders süresi en az 30 dakika olmalıdır.",
        variant: "destructive"
      });
      return false;
    }

    if (duration > 240) {
      toast({
        title: "Geçersiz Ders Süresi",
        description: "Ders süresi en fazla 4 saat olabilir.",
        variant: "destructive"
      });
      return false;
    }

    const hasConflict = checkLessonConflict(
      { start: startTime, end: endTime },
      events,
      event?.id
    );

    if (hasConflict) {
      toast({
        title: "Ders Çakışması",
        description: "Seçilen zaman aralığında başka bir ders bulunuyor.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      title: students?.find(s => s.id === selectedStudent)?.name || "İsimsiz Ders",
      start: startTime,
      end: endTime,
      studentId: selectedStudent,
    });

    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {event ? "Dersi Düzenle" : "Yeni Ders"}
          </DialogTitle>
          <DialogDescription>
            {format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="student">Öğrenci</Label>
            <Select
              value={selectedStudent}
              onValueChange={setSelectedStudent}
            >
              <SelectTrigger>
                <SelectValue placeholder="Öğrenci seçin" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Başlangıç Saati</Label>
            <TimePicker date={startTime} onChange={setStartTime} />
          </div>

          <div className="grid gap-2">
            <Label>Bitiş Saati</Label>
            <TimePicker date={endTime} onChange={setEndTime} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {event && onDelete && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              className="absolute left-4 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" onClick={handleSave}>
            {event ? "Güncelle" : "Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}