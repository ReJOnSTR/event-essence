import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
  students?: Student[];
  onClick?: (event: CalendarEvent) => void;
}

export default function MonthEventCard({ event, students, onClick }: EventCardProps) {
  const student = students?.find(s => s.id === event.studentId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      className="bg-calendar-event text-white text-sm p-1 rounded truncate mb-1 cursor-pointer hover:brightness-90 transition-colors"
      onClick={handleClick}
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