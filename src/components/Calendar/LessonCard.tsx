import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function LessonCard({ event, onClick, students }: EventCardProps) {
  const startMinutes = new Date(event.start).getMinutes();
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const heightInPixels = (durationInMinutes / 60) * 60;
  const student = students?.find(s => s.id === event.studentId);

  const style = {
    height: `${heightInPixels}px`,
    top: `${(startMinutes / 60) * 60}px`,
    zIndex: 10,
    backgroundColor: student?.color || "#039be5",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      className="text-white text-sm p-1 rounded absolute left-0 right-0 mx-1 overflow-hidden cursor-pointer hover:brightness-90 transition-all"
      style={style}
      onClick={handleClick}
    >
      <div className="font-medium truncate">
        {student?.name || "İsimsiz Öğrenci"}
      </div>
      <div className="text-xs flex items-center gap-1">
        <span>{format(event.start, "HH:mm", { locale: tr })}</span>
        <span className="text-white/80">-</span>
        <span>{format(event.end, "HH:mm", { locale: tr })}</span>
      </div>
    </div>
  );
}