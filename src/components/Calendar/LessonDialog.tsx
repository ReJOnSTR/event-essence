import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lesson, Student } from "@/types/calendar";
import { format, isWithinInterval, isEqual } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getDefaultLessonDuration } from "@/utils/settings";
import { motion } from "framer-motion";
import LessonDialogForm from "./LessonDialogForm";

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

  const dialogAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <motion.div {...dialogAnimation}>
          <DialogHeader>
            <DialogTitle>{event ? "Dersi Düzenle" : "Ders Ekle"}</DialogTitle>
            <DialogDescription>
              Ders detaylarını buradan düzenleyebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <LessonDialogForm
            description={description}
            setDescription={setDescription}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            students={students}
            onSubmit={handleSubmit}
            onClose={onClose}
            onDelete={event && onDelete ? handleDelete : undefined}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}