import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import LessonTimeSection from "./LessonTimeSection";
import LessonStudentSection from "./LessonStudentSection";

interface LessonFormProps {
  selectedDate: Date;
  selectedLesson?: CalendarEvent;
  students: Student[];
  onSave: (lesson: Omit<CalendarEvent, "id">) => void;
  onDelete?: (lessonId: string) => void;
  onClose: () => void;
}

export default function LessonForm({
  selectedDate,
  selectedLesson,
  students,
  onSave,
  onDelete,
  onClose
}: LessonFormProps) {
  const [description, setDescription] = useState(selectedLesson?.description || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(selectedLesson?.studentId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    
    const start = new Date(selectedDate);
    start.setHours(startHours, startMinutes);
    
    const end = new Date(selectedDate);
    end.setHours(endHours, endMinutes);
    
    const student = students.find(s => s.id === selectedStudentId);
    
    onSave({
      title: student ? `${student.name} Dersi` : "Ders",
      description,
      start,
      end,
      studentId: selectedStudentId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LessonStudentSection
        students={students}
        selectedStudentId={selectedStudentId}
        onStudentSelect={setSelectedStudentId}
      />
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="text-sm font-medium">Açıklama</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ders açıklaması"
          maxLength={500}
        />
        <div className="text-xs text-muted-foreground">
          {description.length}/100 karakter
        </div>
      </motion.div>
      
      <LessonTimeSection
        startTime={startTime}
        endTime={endTime}
        selectedDate={selectedDate}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between"
      >
        {selectedLesson && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={() => onDelete(selectedLesson.id)}
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
  );
}