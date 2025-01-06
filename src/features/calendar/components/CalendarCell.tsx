import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { isToday } from "date-fns";
import { isHoliday } from "@/utils/turkishHolidays";

interface CalendarCellProps {
  date: Date;
  isDisabled: boolean;
  children?: React.ReactNode;
  droppableId: string;
  index?: number;
  onClick?: () => void;
  className?: string;
  allowWorkOnHolidays?: boolean;
}

export default function CalendarCell({
  date,
  isDisabled,
  children,
  droppableId,
  onClick,
  className,
  allowWorkOnHolidays
}: CalendarCellProps) {
  const holiday = isHoliday(date);

  return (
    <Droppable droppableId={droppableId} isDropDisabled={isDisabled}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            ease: [0.23, 1, 0.32, 1]
          }}
          onClick={!isDisabled ? onClick : undefined}
          className={cn(
            "min-h-[60px] bg-background/80 transition-colors duration-150",
            isToday(date) && "bg-accent text-accent-foreground",
            holiday && !allowWorkOnHolidays && "bg-holiday/10 text-holiday-foreground",
            holiday && allowWorkOnHolidays && "bg-working-holiday/10 text-working-holiday-foreground",
            isDisabled && "bg-muted cursor-not-allowed",
            !isDisabled && "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && !isDisabled && "bg-accent/50",
            className
          )}
        >
          {children}
          {provided.placeholder}
        </motion.div>
      )}
    </Droppable>
  );
}