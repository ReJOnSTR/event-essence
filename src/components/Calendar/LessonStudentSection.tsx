import { Student } from "@/types/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";

interface LessonStudentSectionProps {
  students: Student[];
  selectedStudentId: string;
  onStudentSelect: (studentId: string) => void;
}

export default function LessonStudentSection({
  students,
  selectedStudentId,
  onStudentSelect
}: LessonStudentSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-2"
    >
      <label className="text-sm font-medium">Öğrenci</label>
      <Select
        value={selectedStudentId}
        onValueChange={onStudentSelect}
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
  );
}