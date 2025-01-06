// Taşıyoruz: src/components/Calendar/LessonDialogHeader.tsx -> src/features/calendar/components/LessonDialogHeader.tsx
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface LessonDialogHeaderProps {
  isEditing: boolean;
  selectedDate: Date;
}

export default function LessonDialogHeader({ isEditing, selectedDate }: LessonDialogHeaderProps) {
  const formattedDate = format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr });

  return (
    <DialogHeader>
      <div className="flex items-center gap-2 mb-2">
        <DialogTitle>{isEditing ? "Dersi Düzenle" : "Ders Ekle"}</DialogTitle>
        <Badge variant="secondary" className="text-xs">
          {formattedDate}
        </Badge>
      </div>
      <DialogDescription>
        Ders detaylarını buradan düzenleyebilirsiniz.
      </DialogDescription>
    </DialogHeader>
  );
}