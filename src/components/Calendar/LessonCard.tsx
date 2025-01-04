import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
  index: number;
  isDraggable?: boolean;
}

export default function LessonCard({ 
  event, 
  onClick, 
  students, 
  index,
  isDraggable = true 
}: EventCardProps) {
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

  const content = (provided?: any, snapshot?: any) => (
    <div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      className={cn(
        "text-white p-2 rounded absolute left-1 right-1 overflow-y-auto max-h-full cursor-pointer hover:brightness-90 transition-all shadow-sm scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
        snapshot?.isDragging ? "shadow-lg opacity-70" : "",
        heightInPixels < 40 ? "min-h-[40px] flex flex-col justify-center" : ""
      )}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
      }}
      onClick={handleClick}
    >
      <div className="font-medium text-[13px] leading-tight md:text-sm">
        {student?.name || "İsimsiz Öğrenci"}
      </div>
      <div className="text-[12px] md:text-xs flex items-center gap-1.5 opacity-90 mt-0.5">
        <span>{format(event.start, "HH:mm", { locale: tr })}</span>
        <span className="text-white/90">-</span>
        <span>{format(event.end, "HH:mm", { locale: tr })}</span>
      </div>
    </div>
  );

  if (!isDraggable) {
    return content();
  }

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  );
}