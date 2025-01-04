import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MonthEventCardProps {
  event: CalendarEvent;
  students?: Student[];
  index: number;
  onClick?: (event: CalendarEvent) => void;
}

export default function MonthEventCard({
  event,
  students,
  index,
  onClick
}: MonthEventCardProps) {
  const isMobile = useIsMobile();
  const student = students?.find(s => s.id === event.studentId);
  const start = new Date(event.start);
  const end = new Date(event.end);

  const cardContent = (
    <div
      onClick={() => onClick?.(event)}
      className={cn(
        "text-xs md:text-sm p-1 rounded cursor-pointer transition-colors",
        "hover:opacity-90 active:opacity-80",
        isMobile ? "bg-opacity-90" : ""
      )}
      style={{ backgroundColor: student?.color || '#1a73e8' }}
    >
      <div className="font-medium text-white truncate">
        {format(start, "HH:mm", { locale: tr })} - {format(end, "HH:mm", { locale: tr })}
      </div>
      {student && (
        <div className="text-white/90 truncate">
          {student.name}
        </div>
      )}
    </div>
  );

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "rounded",
            snapshot.isDragging && "opacity-70"
          )}
        >
          {isMobile ? (
            <Tooltip>
              <TooltipTrigger asChild>
                {cardContent}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <div className="text-sm">
                  <div className="font-medium">{student?.name}</div>
                  <div>{format(start, "HH:mm", { locale: tr })} - {format(end, "HH:mm", { locale: tr })}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            cardContent
          )}
        </div>
      )}
    </Draggable>
  );
}