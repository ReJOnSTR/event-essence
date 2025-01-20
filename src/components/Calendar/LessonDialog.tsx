import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lesson, Student } from "@/types/calendar";
import { format, isWithinInterval, isEqual, addDays, addWeeks, addMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import { motion } from "framer-motion";
import LessonDialogHeader from "./LessonDialogHeader";
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
  const [recurrenceType, setRecurrenceType] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  
  const { toast } = useToast();
  const { settings } = useUserSettings();

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setDescription(event.description || "");
        setStartTime(format(event.start, "HH:mm"));
        setEndTime(format(event.end, "HH:mm"));
        setSelectedStudentId(event.studentId || "");
        setRecurrenceType(event.recurrenceType || "none");
        setRecurrenceEndDate(event.recurrenceEndDate || null);
        setRecurrenceInterval(event.recurrenceInterval || 1);
      } else {
        const workingHours = settings?.working_hours;
        const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase() as keyof typeof workingHours;
        const daySettings = workingHours?.[dayOfWeek];

        let initialStartTime;
        if (daySettings?.enabled) {
          const [startHour] = daySettings.start.split(':');
          const currentHours = selectedDate.getHours();
          const currentMinutes = selectedDate.getMinutes();

          if (currentHours < parseInt(startHour)) {
            initialStartTime = daySettings.start;
          } else {
            initialStartTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
          }
        } else {
          initialStartTime = "09:00";
        }

        setStartTime(initialStartTime);
        
        const [hours, minutes] = initialStartTime.split(':').map(Number);
        const startDate = new Date(selectedDate);
        startDate.setHours(hours, minutes, 0, 0);
        
        const defaultDuration = settings?.default_lesson_duration || 60;
        const endDate = new Date(startDate.getTime() + defaultDuration * 60000);
        
        setEndTime(format(endDate, 'HH:mm'));
        setDescription("");
        setSelectedStudentId("");
        setRecurrenceType("none");
        setRecurrenceEndDate(null);
        setRecurrenceInterval(1);
      }
    }
  }, [isOpen, selectedDate, event, settings]);

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

  const createRecurringLessons = (baseStart: Date, baseEnd: Date) => {
    const lessons: Omit<Lesson, "id">[] = [];
    let currentStart = baseStart;
    let currentEnd = baseEnd;

    while (recurrenceEndDate && currentStart <= recurrenceEndDate) {
      if (!checkLessonOverlap(currentStart, currentEnd)) {
        lessons.push({
          title: `${students.find(s => s.id === selectedStudentId)?.name || ""} Dersi`,
          description,
          start: currentStart,
          end: currentEnd,
          studentId: selectedStudentId,
          recurrenceType,
          recurrenceEndDate,
          recurrenceInterval
        });
      }

      switch (recurrenceType) {
        case "daily":
          currentStart = addDays(currentStart, recurrenceInterval);
          currentEnd = addDays(currentEnd, recurrenceInterval);
          break;
        case "weekly":
          currentStart = addWeeks(currentStart, recurrenceInterval);
          currentEnd = addWeeks(currentEnd, recurrenceInterval);
          break;
        case "monthly":
          currentStart = addMonths(currentStart, recurrenceInterval);
          currentEnd = addMonths(currentEnd, recurrenceInterval);
          break;
      }
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
    
    if (recurrenceType !== "none" && recurrenceEndDate) {
      const recurringLessons = createRecurringLessons(start, end);
      recurringLessons.forEach(lesson => onSave(lesson));
    } else {
      onSave({
        title: student ? `${student.name} Dersi` : "Ders",
        description,
        start,
        end,
        studentId: selectedStudentId,
        recurrenceType,
        recurrenceEndDate,
        recurrenceInterval
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <LessonDialogHeader 
            isEditing={!!event}
            selectedDate={selectedDate}
          />
          
          <LessonDialogForm
            description={description}
            onDescriptionChange={handleDescriptionChange}
            startTime={startTime}
            endTime={endTime}
            selectedDate={selectedDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            students={students}
            onDelete={event && onDelete ? () => onDelete(event.id) : undefined}
            onClose={onClose}
            onSubmit={handleSubmit}
            recurrenceType={recurrenceType}
            recurrenceEndDate={recurrenceEndDate}
            recurrenceInterval={recurrenceInterval}
            onRecurrenceTypeChange={setRecurrenceType}
            onRecurrenceEndDateChange={setRecurrenceEndDate}
            onRecurrenceIntervalChange={setRecurrenceInterval}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}