import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lesson, Student } from "@/types/calendar";
import { format, isWithinInterval, isEqual, addWeeks, addMonths, isBefore, getDay } from "date-fns";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getDefaultLessonDuration } from "@/utils/settings";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecurringLessonOptions from "./RecurringLessonOptions";

interface LessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<Lesson, "id">) => void;
  onDelete?: (lessonId: string) => void;
  selectedDate: Date;
  event?: Lesson;
  events: Lesson[];
  students: Student[];
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
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("weekly");
  const [recurrenceCount, setRecurrenceCount] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setDescription(event.description || "");
        setStartTime(format(event.start, "HH:mm"));
        setEndTime(format(event.end, "HH:mm"));
        setSelectedStudentId(event.studentId || "");
        setIsRecurring(false);
        setRecurrenceCount(1);
      } else {
        const hours = selectedDate.getHours();
        const minutes = selectedDate.getMinutes();
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const startTimeStr = `${formattedHours}:${formattedMinutes}`;
        setStartTime(startTimeStr);
        
        const defaultDuration = getDefaultLessonDuration();
        const endDate = new Date(selectedDate);
        endDate.setMinutes(endDate.getMinutes() + defaultDuration);
        const endHours = endDate.getHours();
        const endMinutes = endDate.getMinutes();
        const endTimeStr = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
        setEndTime(endTimeStr);
        
        setDescription("");
        setSelectedStudentId("");
        setIsRecurring(false);
        setRecurrenceCount(1);
      }
    }
  }, [isOpen, selectedDate, event]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setDescription(value);
    } else {
      toast({
        title: "Karakter Sınırı",
        description: "Açıklama en fazla 100 karakter olabilir.",
        variant: "destructive",
      });
    }
  };

  const checkLessonOverlap = (start: Date, end: Date, skipLessonId?: string) => {
    if (isBefore(end, start)) {
      return true; // Bitiş saati başlangıç saatinden önce olamaz
    }

    return events.some(existingEvent => {
      if (skipLessonId && existingEvent.id === skipLessonId) return false;
      
      const existingStart = new Date(existingEvent.start);
      const existingEnd = new Date(existingEvent.end);

      if (isEqual(start, existingEnd) || isEqual(end, existingStart)) {
        return false;
      }

      return (
        isWithinInterval(start, { start: existingStart, end: existingEnd }) ||
        isWithinInterval(end, { start: existingStart, end: existingEnd }) ||
        isWithinInterval(existingStart, { start, end }) ||
        isWithinInterval(existingEnd, { start, end })
      );
    });
  };

  const createRecurringLessons = (baseStart: Date, baseEnd: Date) => {
    const lessons = [];
    let currentStart = new Date(baseStart);
    let currentEnd = new Date(baseEnd);

    // İlk dersi ekle
    lessons.push({
      start: new Date(currentStart),
      end: new Date(currentEnd)
    });

    // Tekrarlayan dersleri ekle
    for (let i = 1; i < recurrenceCount; i++) {
      if (recurrenceType === "weekly") {
        currentStart = addWeeks(currentStart, 1);
        currentEnd = addWeeks(currentEnd, 1);
      } else if (recurrenceType === "monthly") {
        currentStart = addMonths(currentStart, 1);
        currentEnd = addMonths(currentEnd, 1);
      }

      // Çakışma kontrolü
      if (checkLessonOverlap(currentStart, currentEnd, event?.id)) {
        toast({
          title: "Çakışma Tespit Edildi",
          description: `${format(currentStart, "dd.MM.yyyy HH:mm")} tarihinde başka bir ders bulunuyor.`,
          variant: "destructive"
        });
        return null;
      }

      lessons.push({
        start: new Date(currentStart),
        end: new Date(currentEnd)
      });
    }

    return lessons;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudentId) {
      toast({
        title: "Öğrenci Seçilmedi",
        description: "Lütfen bir öğrenci seçin.",
        variant: "destructive"
      });
      return;
    }

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    
    const start = new Date(selectedDate);
    start.setHours(startHours, startMinutes, 0, 0);
    
    const end = new Date(selectedDate);
    end.setHours(endHours, endMinutes, 0, 0);

    if (isBefore(end, start)) {
      toast({
        title: "Geçersiz Zaman Aralığı",
        description: "Bitiş saati başlangıç saatinden önce olamaz.",
        variant: "destructive"
      });
      return;
    }

    if (!isRecurring) {
      if (checkLessonOverlap(start, end, event?.id)) {
        toast({
          title: "Zaman Çakışması",
          description: "Bu zaman aralığında başka bir ders bulunuyor.",
          variant: "destructive"
        });
        return;
      }
    } else {
      const recurringLessons = createRecurringLessons(start, end);
      if (!recurringLessons) return; // Çakışma varsa işlemi durdur
      
      const student = students.find(s => s.id === selectedStudentId);
      recurringLessons.forEach(lesson => {
        onSave({
          title: student ? `${student.name} Dersi` : "Ders",
          description,
          start: lesson.start,
          end: lesson.end,
          studentId: selectedStudentId,
        });
      });
      
      onClose();
      return;
    }
    
    const student = students.find(s => s.id === selectedStudentId);
    
    onSave({
      title: student ? `${student.name} Dersi` : "Ders",
      description,
      start,
      end,
      studentId: selectedStudentId,
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
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle>{event ? "Dersi Düzenle" : "Ders Ekle"}</DialogTitle>
            <DialogDescription>
              Ders detaylarını buradan düzenleyebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label>Öğrenci</Label>
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  <AnimatePresence>
                    {students.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <SelectItem value={student.id}>
                          {student.name}
                        </SelectItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label>Açıklama</Label>
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Ders açıklaması"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground">
                {description.length}/100 karakter
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label>Başlangıç Saati</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Bitiş Saati</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {!event && (
              <RecurringLessonOptions
                isRecurring={isRecurring}
                recurrenceType={recurrenceType}
                recurrenceCount={recurrenceCount}
                onRecurringChange={setIsRecurring}
                onRecurrenceTypeChange={setRecurrenceType}
                onRecurrenceCountChange={setRecurrenceCount}
              />
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-between"
            >
              {event && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button type="button" variant="outline" onClick={onClose}>
                  İptal
                </Button>
                <Button type="submit">Kaydet</Button>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}