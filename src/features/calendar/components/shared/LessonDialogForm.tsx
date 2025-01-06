import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/types/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
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
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="student" className="text-sm font-medium">
            Öğrenci
          </label>
          <Select
            value={selectedStudentId}
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Öğrenci seçin" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <LessonTimeInputs
          startTime={startTime}
          endTime={endTime}
          selectedDate={selectedDate}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
        />

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Açıklama
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Ders hakkında notlar..."
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground text-right">
            {description.length}/100
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Sil
          </Button>
        )}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            İptal
          </Button>
          <Button type="submit" className="flex-1 sm:flex-none">
            Kaydet
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}