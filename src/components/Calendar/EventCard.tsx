import { CalendarEvent } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const heightInPixels = (durationInMinutes / 60) * 60; // 60px per hour

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: event.id,
    data: event
  });

  const style = {
    height: `${heightInPixels}px`,
    top: `${(new Date(event.start).getMinutes() / 60) * 60}px`,
    zIndex: 10,
    transform: CSS.Translate.toString(transform),
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className="bg-calendar-event text-white text-sm p-1 rounded absolute left-0 right-0 mx-1 overflow-hidden cursor-move hover:brightness-90 transition-all group"
      style={style}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-1">
        <GripVertical className="h-4 w-4 opacity-50 group-hover:opacity-100" />
        <div className="flex-1">
          <div className="font-medium truncate">{event.title}</div>
          <div className="text-xs">
            {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
          </div>
        </div>
      </div>
    </div>
  );
}