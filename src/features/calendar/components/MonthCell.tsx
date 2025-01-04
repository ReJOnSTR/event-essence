import { format, isToday, isHoliday } from "date-fns";
import { tr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import MonthEventCard from "./MonthEventCard";
import { motion } from "framer-motion";

interface MonthCellProps {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    lessons: CalendarEvent[];
  };
  idx: number;
  holiday: any;
  allowWorkOnHolidays: boolean;
  handleDateClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthCell({
  day,
  idx,
  holiday,
  allowWorkOnHolidays,
  handleDateClick,
  onEventClick,
  students
}: MonthCellProps) {
  return (
    <Droppable droppableId={`${idx}`}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            delay: idx * 0.01,
            ease: [0.23, 1, 0.32, 1]
          }}
          onClick={() => handleDateClick(day.date)}
          className={cn(
            "min-h-[120px] p-2 bg-white cursor-pointer transition-colors duration-150",
            !day.isCurrentMonth && "bg-gray-50 text-gray-400",
            isToday(day.date) && "bg-blue-50",
            holiday && !allowWorkOnHolidays && "bg-red-50",
            holiday && allowWorkOnHolidays && "bg-yellow-50",
            snapshot.isDraggingOver && "bg-blue-50"
          )}
        >
          <div className={cn(
            "text-sm font-medium mb-1",
            isToday(day.date) && "text-calendar-blue",
            holiday && !allowWorkOnHolidays && "text-red-600",
            holiday && allowWorkOnHolidays && "text-yellow-700"
          )}>
            {format(day.date, "d")}
            {holiday && (
              <div className={cn(
                "text-xs truncate",
                !allowWorkOnHolidays ? "text-red-600" : "text-yellow-700"
              )}>
                {holiday.name}
                {allowWorkOnHolidays && " (Çalışmaya Açık)"}
              </div>
            )}
          </div>
          <div className="space-y-1">
            {day.lessons.map((event, index) => (
              <MonthEventCard
                key={event.id}
                event={event}
                students={students}
                index={index}
                onClick={onEventClick}
              />
            ))}
            {provided.placeholder}
          </div>
        </motion.div>
      )}
    </Droppable>
  );
}