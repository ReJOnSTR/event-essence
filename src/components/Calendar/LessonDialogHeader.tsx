import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";

interface LessonDialogHeaderProps {
  isEditing: boolean;
  selectedDate: Date;
  isPartOfRecurring?: boolean;
}

export default function LessonDialogHeader({ 
  isEditing, 
  selectedDate,
  isPartOfRecurring
}: LessonDialogHeaderProps) {
  return (
    <DialogHeader className="space-y-4">
      <div className="flex items-center justify-between">
        <DialogTitle>
          {isEditing ? "Dersi Düzenle" : "Yeni Ders"}
        </DialogTitle>
        {isPartOfRecurring && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            Tekrarlanan Ders
          </Badge>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        {format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })}
      </div>
    </DialogHeader>
  );
}