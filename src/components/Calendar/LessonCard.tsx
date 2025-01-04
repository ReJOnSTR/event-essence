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
        "text-white text-[11px] md:text-sm p-1.5 rounded absolute left-0 right-0 mx-1 overflow-hidden cursor-pointer hover:brightness-90 transition-all",
        snapshot?.isDragging ? "shadow-lg opacity-70" : "",
        heightInPixels < 40 ? "min-h-[40px] flex flex-col justify-center" : "",
        "hover:z-50"
      )}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
      }}
      onClick={handleClick}
    >
      <div className="font-medium truncate leading-tight mb-0.5">
        {student?.name || "İsimsiz Öğrenci"}
      </div>
      <div className="text-[10px] md:text-xs flex items-center gap-1 opacity-90 whitespace-nowrap">
        <span>{format(event.start, "HH:mm", { locale: tr })}</span>
        <span className="text-white/80">-</span>
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