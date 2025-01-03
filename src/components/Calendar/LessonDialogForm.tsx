import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/types/calendar";

interface LessonDialogFormProps {
  description: string;
  setDescription: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  selectedStudentId: string;
  setSelectedStudentId: (value: string) => void;
  students: Student[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export default function LessonDialogForm({
  description,
  setDescription,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  selectedStudentId,
  setSelectedStudentId,
  students,
  onSubmit,
  onClose,
  onDelete,
}: LessonDialogFormProps) {
  const formAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  };

  const itemAnimation = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <motion.div {...itemAnimation} className="space-y-2">
        <label className="text-sm font-medium">Öğrenci</label>
        <Select
          value={selectedStudentId}
          onValueChange={setSelectedStudentId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Öğrenci seçin" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.15,
                  delay: index * 0.02,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <SelectItem value={student.id}>
                  {student.name}
                </SelectItem>
              </motion.div>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
      
      <motion.div {...itemAnimation} className="space-y-2">
        <label className="text-sm font-medium">Açıklama</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ders açıklaması"
        />
      </motion.div>
      
      <motion.div {...itemAnimation} className="grid grid-cols-2 gap-4">
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
      
      <motion.div {...formAnimation} className="flex justify-between">
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
