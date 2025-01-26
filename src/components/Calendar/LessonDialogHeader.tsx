import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/types/calendar";
import { CalendarClock } from "lucide-react";

interface LessonDialogHeaderProps {
  isEditing: boolean;
  selectedDate: Date;
  event?: Lesson;
}

export default function LessonDialogHeader({ isEditing, selectedDate, event }: LessonDialogHeaderProps) {
  const formattedDate = format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr });
  const isRecurring = event?.recurrenceType && event.recurrenceType !== "none";
  const isPartOfSeries = event?.parentLessonId || (isRecurring && event?.recurrenceCount && event.recurrenceCount > 1);

  return (
    <DialogHeader>
      <div className="flex items-center gap-2 mb-2">
        <DialogTitle>{isEditing ? "Dersi Düzenle" : "Ders Ekle"}</DialogTitle>
        <Badge variant="secondary" className="text-xs">
          {formattedDate}
        </Badge>
      </div>
      {isPartOfSeries && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <CalendarClock className="h-4 w-4" />
          <span>
            Bu ders {event?.recurrenceType === "weekly" ? "haftalık" : "aylık"} tekrar eden bir dersin parçasıdır
          </span>
        </div>
      )}
      <DialogDescription>
        Ders detaylarını buradan düzenleyebilirsiniz.
      </DialogDescription>
    </DialogHeader>
  );
}