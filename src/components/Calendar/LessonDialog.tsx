import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lesson, Student } from "@/types/calendar";
import { format, isWithinInterval, isEqual } from "date-fns";
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
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setDescription(event.description || "");
        setStartTime(format(event.start, "HH:mm"));
        setEndTime(format(event.end, "HH:mm"));
        setSelectedStudentId(event.studentId || "");
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

  const checkLessonOverlap = (start: Date, end: Date) => {
    return events.some(existingEvent => {
      if (event && existingEvent.id === event.id) return false;
      
      if (isEqual(start, existingEvent.end) || isEqual(end, existingEvent.start)) {
        return false;
      }

      return (
        isWithinInterval(start, { start: existingEvent.start, end: existingEvent.end }) ||
        isWithinInterval(end, { start: existingEvent.start, end: existingEvent.end }) ||
        isWithinInterval(existingEvent.start, { start, end }) ||
        isWithinInterval(existingEvent.end, { start, end })
      );
    });
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
    start.setHours(startHours, startMinutes);
    
    const end = new Date(selectedDate);
    end.setHours(endHours, endMinutes);

    if (checkLessonOverlap(start, end)) {
      toast({
        title: "Zaman Çakışması",
        description: "Bu zaman aralığında başka bir ders bulunuyor.",
        variant: "destructive"
      });
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
              <label className="text-sm font-medium">Öğrenci</label>
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
              <label className="text-sm font-medium">Açıklama</label>
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
                <label className="text-sm font-medium">Başlangıç Saati</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bitiş Saati</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </motion.div>
            
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
