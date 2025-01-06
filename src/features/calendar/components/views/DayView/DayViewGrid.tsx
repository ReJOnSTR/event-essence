import { format } from "date-fns";
import { motion } from "framer-motion";
import { TimeIndicator } from "@/components/Calendar/TimeIndicator";
import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "@/components/Calendar/LessonCard";

interface DayViewGridProps {
  hours: number[];
  events: CalendarEvent[];
  onHourClick: (hour: number) => void;
  isHourDisabled: (hour: number) => boolean;
  students?: Student[];
  onEventClick?: (event: CalendarEvent) => void;
  allowWorkOnHolidays: boolean;
}

export default function DayViewGrid({
  hours,
  events,
  onHourClick,
  isHourDisabled,
  students,
  onEventClick,
  allowWorkOnHolidays
}: DayViewGridProps) {
  return (
    <div className="space-y-2">
      {hours.map((hour, index) => (
        <motion.div 
          key={hour}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.25,
            delay: index * 0.02,
            ease: [0.23, 1, 0.32, 1]
          }}
          className="grid grid-cols-12 gap-2"
        >
          <div className="col-span-1 text-right text-sm text-muted-foreground relative">
            {`${hour.toString().padStart(2, '0')}:00`}
            <TimeIndicator events={events} hour={hour} />
          </div>
          <Droppable droppableId={`${hour}:0`}>
            {(provided, snapshot) => (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "col-span-11 min-h-[60px] border-t border-border cursor-pointer relative",
                  snapshot.isDraggingOver && "bg-accent",
                  isHourDisabled(hour) && "bg-muted cursor-not-allowed"
                )}
                onClick={() => onHourClick(hour)}
              >
                {events
                  .filter(event => new Date(event.start).getHours() === hour)
                  .map((event, index) => (
                    <LessonCard 
                      key={event.id} 
                      event={event} 
                      onClick={onEventClick}
                      students={students}
                      index={index}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </motion.div>
      ))}
    </div>
  );
}