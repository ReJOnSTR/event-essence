import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { useLanguage } from "@/contexts/LanguageContext";

interface EventCardProps {
  event: CalendarEvent;
  students?: Student[];
}

export default function MonthEventCard({ event, students }: EventCardProps) {
  const student = students?.find(s => s.id === event.studentId);
  const { t } = useLanguage();

  return (
    <div 
      className="text-white text-sm p-1 rounded truncate mb-1 cursor-pointer hover:brightness-90 transition-colors"
      style={{ backgroundColor: student?.color || "#039be5" }}
    >
      <div className="flex items-center gap-1">
        <span className="font-medium truncate">
          {student?.name || t.students.unnamed}
        </span>
        <span className="text-xs whitespace-nowrap">
          {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
        </span>
      </div>
    </div>
  );
}