import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lesson, Student } from "@/types/calendar";
import { format, isEqual, addWeeks, addMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import LessonDialogHeader from "./LessonDialogHeader";
import LessonDialogForm from "./LessonDialogForm";
import { isHoliday } from "@/utils/turkishHolidays";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [recurrenceType, setRecurrenceType] = useState<"none" | "weekly" | "monthly">("none");
  const [recurrenceCount, setRecurrenceCount] = useState(1);
  const [showHolidayDialog, setShowHolidayDialog] = useState(false);
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  const [currentHolidayDate, setCurrentHolidayDate] = useState<Date | null>(null);
  const [pendingLessons, setPendingLessons] = useState<Omit<Lesson, "id">[]>([]);
  
  const { toast } = useToast();
  const { settings } = useUserSettings();

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setDescription(event.description || "");
        setStartTime(format(event.start, "HH:mm"));
        setEndTime(format(event.end, "HH:mm"));
        setSelectedStudentId(event.studentId || "");
        setRecurrenceType(event.recurrenceType as "none" | "weekly" | "monthly" || "none");
        setRecurrenceCount(event.recurrenceCount || 1);
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
        setRecurrenceCount(1);
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

  const isDateAvailable = (date: Date) => {
    const workingHours = settings?.working_hours;
    const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours?.[dayOfWeek];

    if (!daySettings?.enabled) {
      return false;
    }

    return true;
  };

  const createRecurringLessons = async (baseStart: Date, baseEnd: Date) => {
    const lessons: Omit<Lesson, "id">[] = [];
    let currentStart = baseStart;
    let currentEnd = baseEnd;
    let count = 0;
    let attempts = 0;
    const maxAttempts = recurrenceCount * 3;

    while (count < recurrenceCount && attempts < maxAttempts) {
      const customHolidays = settings?.holidays || [];
      const holiday = isHoliday(currentStart, customHolidays);
      
      if (holiday && !settings?.allow_work_on_holidays) {
        setCurrentHolidayDate(currentStart);
        setShowHolidayDialog(true);
        setPendingLessons([]);
        const currentLesson = {
          title: `${students.find(s => s.id === selectedStudentId)?.name || ""} Dersi`,
          description,
          start: currentStart,
          end: currentEnd,
          studentId: selectedStudentId,
          recurrenceType,
          recurrenceCount
        };
        setPendingLessons([...lessons, currentLesson]);
        return [];
      }

      if (isDateAvailable(currentStart) && !checkLessonOverlap(currentStart, currentEnd)) {
        lessons.push({
          title: `${students.find(s => s.id === selectedStudentId)?.name || ""} Dersi`,
          description,
          start: currentStart,
          end: currentEnd,
          studentId: selectedStudentId,
          recurrenceType,
          recurrenceCount
        });
        count++;
      }

      attempts++;

      switch (recurrenceType) {
        case "weekly":
          currentStart = addWeeks(currentStart, 1);
          currentEnd = addWeeks(currentEnd, 1);
          break;
        case "monthly":
          currentStart = addMonths(currentStart, 1);
          currentEnd = addMonths(currentEnd, 1);
          break;
      }
    }

    if (count < recurrenceCount) {
      toast({
        title: "Uyarı",
        description: `Bazı tekrar eden dersler, çalışma saatleri kapalı veya tatil günlerine denk geldiği için oluşturulamadı.`,
        variant: "warning"
      });
    }

    return lessons;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!isDateAvailable(start)) {
      toast({
        title: "Uygun Olmayan Tarih",
        description: "Seçilen tarih çalışma saatleri dışında.",
        variant: "destructive"
      });
      return;
    }

    if (checkLessonOverlap(start, end)) {
      toast({
        title: "Zaman Çakışması",
        description: "Bu zaman aralığında başka bir ders bulunuyor.",
        variant: "destructive"
      });
      return;
    }
    
    const student = students.find(s => s.id === selectedStudentId);

    // Düzenleme modunda ve tekrar sıklığı değiştiyse
    if (event && event.recurrenceType !== recurrenceType) {
      setShowRecurrenceDialog(true);
      return;
    }
    
    if (recurrenceType !== "none" && !event) {
      const recurringLessons = await createRecurringLessons(start, end);
      if (recurringLessons.length > 0) {
        recurringLessons.forEach(lesson => onSave(lesson));
        onClose();
      }
    } else {
      onSave({
        title: student ? `${student.name} Dersi` : "Ders",
        description,
        start,
        end,
        studentId: selectedStudentId,
        recurrenceType,
        recurrenceCount
      });
      onClose();
    }
  };

  const handleRecurrenceConfirm = async () => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    
    const start = new Date(selectedDate);
    start.setHours(startHours, startMinutes);
    
    const end = new Date(selectedDate);
    end.setHours(endHours, endMinutes);

    const student = students.find(s => s.id === selectedStudentId);

    if (recurrenceType !== "none") {
      const recurringLessons = await createRecurringLessons(start, end);
      if (recurringLessons.length > 0) {
        // Önce eski dersi sil
        if (event && onDelete) {
          onDelete(event.id);
        }
        // Sonra yeni tekrar eden dersleri ekle
        recurringLessons.forEach(lesson => onSave(lesson));
      }
    } else {
      onSave({
        title: student ? `${student.name} Dersi` : "Ders",
        description,
        start,
        end,
        studentId: selectedStudentId,
        recurrenceType,
        recurrenceCount
      });
    }
    setShowRecurrenceDialog(false);
    onClose();
  };

  const handleHolidayConfirm = async () => {
    await updateSettings.mutateAsync({
      allow_work_on_holidays: true
    });
    setShowHolidayDialog(false);
    
    if (pendingLessons.length > 0) {
      pendingLessons.forEach(lesson => onSave(lesson));
      setPendingLessons([]);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <div className="p-6">
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
              recurrenceCount={recurrenceCount}
              onRecurrenceTypeChange={setRecurrenceType}
              onRecurrenceCountChange={setRecurrenceCount}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRecurrenceDialog} onOpenChange={setShowRecurrenceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tekrar Sıklığı Değişikliği</AlertDialogTitle>
            <AlertDialogDescription>
              Bu dersin tekrar sıklığını değiştirmek istediğinizden emin misiniz? Bu işlem mevcut tekrar eden dersleri silecek ve yeni tekrar sıklığına göre yeniden oluşturacaktır.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRecurrenceDialog(false)}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRecurrenceConfirm}>
              Devam Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showHolidayDialog} onOpenChange={setShowHolidayDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tatil Günü Uyarısı</DialogTitle>
            <DialogDescription>
              {currentHolidayDate && `${format(currentHolidayDate, 'd MMMM yyyy')} tarihi tatil günü. Bu tarih için çalışma iznini açmak ister misiniz?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowHolidayDialog(false);
              onClose();
            }}>
              İptal
            </Button>
            <Button onClick={handleHolidayConfirm}>
              Çalışma İznini Aç
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}