import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarEvent, Student, RecurrencePattern } from "@/types/calendar";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useToast } from "@/hooks/use-toast";
import { addMinutes, format } from "date-fns";
import { tr } from 'date-fns/locale';
import RecurrenceSettings from './RecurrenceSettings';

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
  students = [],
}: LessonDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = React.useState(event?.title || "");
  const [description, setDescription] = React.useState(event?.description || "");
  const [studentId, setStudentId] = React.useState(event?.studentId || "");
  const [startTime, setStartTime] = React.useState(
    format(event?.start || selectedDate, "HH:mm")
  );
  const [endTime, setEndTime] = React.useState(
    format(
      event?.end || addMinutes(selectedDate, 60),
      "HH:mm"
    )
  );
  const [recurrencePattern, setRecurrencePattern] = React.useState<RecurrencePattern | undefined>(
    event?.recurrencePattern
  );

  React.useEffect(() => {
    if (isOpen) {
      setTitle(event?.title || "");
      setDescription(event?.description || "");
      setStudentId(event?.studentId || "");
      setStartTime(format(event?.start || selectedDate, "HH:mm"));
      setEndTime(
        format(
          event?.end || addMinutes(selectedDate, 60),
          "HH:mm"
        )
      );
      setRecurrencePattern(event?.recurrencePattern);
    }
  }, [isOpen, event, selectedDate]);

  const handleSave = () => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const start = new Date(selectedDate);
    start.setHours(startHours, startMinutes, 0);

    const end = new Date(selectedDate);
    end.setHours(endHours, endMinutes, 0);

    if (end <= start) {
      toast({
        title: "Geçersiz zaman aralığı",
        description: "Bitiş zamanı başlangıç zamanından sonra olmalıdır.",
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
        description: "Seçilen zaman aralığında başka bir ders bulunuyor.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      title,
      description,
      start,
      end,
      studentId: studentId || undefined,
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
            <Label htmlFor="student">Öğrenci</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Öğrenci seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Öğrenci seçin</SelectItem>
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
              <Label htmlFor="startTime">Başlangıç</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Bitiş</Label>
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
              value={recurrencePattern}
              onChange={setRecurrencePattern}
              startDate={selectedDate}
            />
          </div>
        </div>

        <div className="flex justify-between">
          {event && onDelete && (
            <Button
              variant="destructive"
              onClick={() => onDelete(event.id)}
            >
              Sil
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={handleSave}>
              {event ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}