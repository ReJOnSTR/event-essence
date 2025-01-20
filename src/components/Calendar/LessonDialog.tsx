import { useState, useEffect } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarEvent, Student, RecurrencePattern } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useToast } from "@/hooks/use-toast";
import RecurrenceSettings from "./RecurrenceSettings";

interface LessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<CalendarEvent, "id">) => void;
  onDelete?: (lessonId: string) => void;
  selectedDate: Date;
  event?: CalendarEvent;
  events?: CalendarEvent[];
  students?: Student[];
}

export default function LessonDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  event,
  events = [],
  students = [],
}: LessonDialogProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [studentId, setStudentId] = useState(event?.studentId || "_none");
  const [startTime, setStartTime] = useState(
    format(event?.start || selectedDate, "HH:mm")
  );
  const [endTime, setEndTime] = useState(
    format(
      event?.end || new Date(selectedDate.getTime() + 60 * 60 * 1000),
      "HH:mm"
    )
  );
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern | null>(
    event?.recurrencePattern || null
  );

  const { toast } = useToast();

  useEffect(() => {
    if (!event) {
      setTitle("");
      setDescription("");
      setStudentId("_none");
      setStartTime(format(selectedDate, "HH:mm"));
      setEndTime(
        format(new Date(selectedDate.getTime() + 60 * 60 * 1000), "HH:mm")
      );
      setRecurrencePattern(null);
    }
  }, [event, selectedDate]);

  const handleSave = () => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0);

    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0);

    if (end <= start) {
      toast({
        title: "Hata",
        description: "Bitiş saati başlangıç saatinden sonra olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    const hasConflict = checkLessonConflict(
      { start, end },
      events,
      event?.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen saatte başka bir ders bulunuyor.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      title,
      description,
      start,
      end,
      studentId: studentId === "_none" ? null : studentId,
      recurrencePattern,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {event ? "Dersi Düzenle" : "Yeni Ders"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ders başlığı"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ders açıklaması"
            />
          </div>

          <div className="space-y-2">
            <Label>Öğrenci</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Öğrenci seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Öğrenci seçin</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Başlangıç Saati</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Bitiş Saati</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tekrar</Label>
            <RecurrenceSettings
              recurrencePattern={recurrencePattern}
              onRecurrenceChange={setRecurrencePattern}
              startDate={selectedDate}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          {event && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(event.id)}
            >
              Sil
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button type="button" onClick={handleSave}>
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}