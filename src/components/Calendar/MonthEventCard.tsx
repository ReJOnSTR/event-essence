import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
  students?: Student[];
}

export default function MonthEventCard({ event, students }: EventCardProps) {
  const student = students?.find(s => s.id === event.studentId);

  return (
    <div 
      className="text-white text-sm p-1 rounded truncate mb-1 cursor-pointer hover:brightness-90 transition-colors"
      style={{ backgroundColor: student?.color || "#039be5" }}
    >
      <div className="flex items-center gap-1">
        <span className="font-medium truncate">
          {student?.name || "İsimsiz Öğrenci"}
        </span>
        <span className="text-xs whitespace-nowrap">
          {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
        </span>
      </div>
    </div>
  );
}