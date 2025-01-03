import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";

interface EventCardProps {
  event: CalendarEvent;
  students?: Student[];
  index: number;
  onClick?: (event: CalendarEvent) => void;
}

export default function MonthEventCard({ event, students, index, onClick }: EventCardProps) {
  const student = students?.find(s => s.id === event.studentId);

  const content = (provided?: any, snapshot?: any) => (
    <div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      className={`text-white text-sm p-1.5 rounded mb-1 cursor-pointer hover:brightness-90 transition-all ${
        snapshot?.isDragging ? "shadow-lg scale-105 z-50" : ""
      }`}
      style={{ 
        backgroundColor: student?.color || "#039be5",
        ...(provided?.draggableProps?.style || {})
      }}
      onClick={() => onClick?.(event)}
    >
      <div className="flex flex-col gap-0.5">
        <div className="font-medium truncate">
          {student?.name || "İsimsiz Öğrenci"}
        </div>
        <div className={`text-xs flex items-center gap-1 transition-all ${
          snapshot?.isDragging ? "opacity-100" : "opacity-80"
        }`}>
          <span>{format(new Date(event.start), "HH:mm", { locale: tr })}</span>
          <span>-</span>
          <span>{format(new Date(event.end), "HH:mm", { locale: tr })}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  );
}