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
  onSubmit
}: LessonDialogFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <label className="text-base font-medium">Öğrenci</label>
        <Select
          value={selectedStudentId}
          onValueChange={setSelectedStudentId}
        >
          <SelectTrigger className="w-full h-12">
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
                  <SelectItem value={student.id} className="py-3">
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
        className="space-y-3"
      >
        <label className="text-base font-medium">Açıklama</label>
        <Textarea
          value={description}
          onChange={onDescriptionChange}
          placeholder="Ders açıklaması"
          className="min-h-[100px] text-base"
          maxLength={500}
        />
        <div className="text-sm text-muted-foreground">
          {description.length}/100 karakter
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <label className="text-base font-medium">Ders Saati</label>
        <LessonTimeInputs
          startTime={startTime}
          endTime={endTime}
          selectedDate={selectedDate}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-4"
      >
        {onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDelete}
            className="flex items-center gap-2"
            size="lg"
          >
            <Trash2 className="h-5 w-5" />
            Sil
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            size="lg"
          >
            İptal
          </Button>
          <Button 
            type="submit"
            size="lg"
          >
            Kaydet
          </Button>
        </div>
      </motion.div>
    </form>
  );
}