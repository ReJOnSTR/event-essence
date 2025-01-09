import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CalendarEvent, Student } from "@/types/calendar";
import { useWorkingHours } from "@/hooks/useWorkingHours";
import LessonDialogHeader from "./LessonDialogHeader";
import LessonDialogForm from "./LessonDialogForm";

interface LessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<CalendarEvent, "id">) => void;
  onDelete?: (id: string) => void;
  selectedDate?: Date;
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
  students = []
}: LessonDialogProps) {
  const { defaultLessonDuration } = useWorkingHours();
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [startTime, setStartTime] = useState<Date>(
    event?.start || selectedDate || new Date()
  );
  const [endTime, setEndTime] = useState<Date>(() => {
    if (event?.end) return event.end;
    if (selectedDate) {
      const end = new Date(selectedDate);
      end.setMinutes(end.getMinutes() + defaultLessonDuration);
      return end;
    }
    const end = new Date();
    end.setMinutes(end.getMinutes() + defaultLessonDuration);
    return end;
  });
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>(
    event?.studentId
  );

  useEffect(() => {
    if (selectedDate) {
      setStartTime(selectedDate);
      const end = new Date(selectedDate);
      end.setMinutes(end.getMinutes() + defaultLessonDuration);
      setEndTime(end);
    }
  }, [selectedDate, defaultLessonDuration]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setStartTime(event.start);
      setEndTime(event.end);
      setSelectedStudent(event.studentId);
    } else {
      setTitle("");
      setDescription("");
      setSelectedStudent(undefined);
    }
  }, [event]);

  const handleSave = () => {
    onSave({
      title,
      description,
      start: startTime,
      end: endTime,
      studentId: selectedStudent,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <LessonDialogHeader
          isEditing={!!event}
          onDelete={event ? () => onDelete?.(event.id) : undefined}
        />
        <LessonDialogForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          students={students}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}