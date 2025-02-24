import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LessonTimeInputs from "./LessonTimeInputs";
import RecurrenceSettings from "./RecurrenceSettings";

interface LessonDialogFormProps {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  startTime: string;
  endTime: string;
  selectedDate: Date;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  students: Student[];
  onDelete?: () => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  recurrenceType: "none" | "weekly" | "monthly";
  recurrenceCount: number;
  onRecurrenceTypeChange: (value: "none" | "weekly" | "monthly") => void;
  onRecurrenceCountChange: (count: number) => void;
}

export default function LessonDialogForm({
  description,
  onDescriptionChange,
  startTime,
  endTime,
  selectedDate,
  setStartTime,
  setEndTime,
  selectedStudentId,
  setSelectedStudentId,
  students,
  onDelete,
  onClose,
  onSubmit,
  recurrenceType,
  recurrenceCount,
  onRecurrenceTypeChange,
  onRecurrenceCountChange
}: LessonDialogFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          onChange={onDescriptionChange}
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
      >
        <LessonTimeInputs
          startTime={startTime}
          endTime={endTime}
          selectedDate={selectedDate}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RecurrenceSettings
          recurrenceType={recurrenceType}
          recurrenceCount={recurrenceCount}
          onRecurrenceTypeChange={onRecurrenceTypeChange}
          onRecurrenceCountChange={onRecurrenceCountChange}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between"
      >
        {onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDelete}
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