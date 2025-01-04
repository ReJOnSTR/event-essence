import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import LessonForm from "./LessonForm";

interface LessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<CalendarEvent, "id">) => void;
  onDelete?: (lessonId: string) => void;
  selectedDate: Date;
  event?: CalendarEvent;
  students: Student[];
}

export default function LessonDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  selectedDate,
  event,
  students
}: LessonDialogProps) {
  const handleSave = (lessonData: Omit<CalendarEvent, "id">) => {
    onSave(lessonData);
    onClose();
  };

  const handleDelete = (lessonId: string) => {
    if (onDelete) {
      onDelete(lessonId);
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
          
          <LessonForm
            selectedDate={selectedDate}
            selectedLesson={event}
            students={students}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={onClose}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}