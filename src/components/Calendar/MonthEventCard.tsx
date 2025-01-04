import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: CalendarEvent;
  students?: Student[];
  index: number;
  onClick?: (event: CalendarEvent) => void;
}

export default function MonthEventCard({ event, students, index, onClick }: EventCardProps) {
  const student = students?.find(s => s.id === event.studentId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(event);
  };

  const content = (provided?: any, snapshot?: any) => (
    <div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      className={cn(
        "text-white text-xs p-1 rounded mb-1 cursor-pointer hover:brightness-90 transition-colors",
        snapshot?.isDragging ? "shadow-lg opacity-70" : ""
      )}
      style={{ 
        backgroundColor: student?.color || "#039be5",
        ...(provided?.draggableProps?.style || {})
      }}
      onClick={handleClick}
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-1">
        <span className="font-medium truncate leading-tight">
          {student?.name || "İsimsiz Öğrenci"}
        </span>
        <span className="text-[10px] md:text-xs whitespace-nowrap opacity-90">
          {format(new Date(event.start), "HH:mm", { locale: tr })} - {format(new Date(event.end), "HH:mm", { locale: tr })}
        </span>
      </div>
    </div>
  );

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  );
}