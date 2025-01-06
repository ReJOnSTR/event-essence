import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { motion } from "framer-motion";

interface TimeIndicatorProps {
  events: CalendarEvent[];
  hour: number;
}

export function TimeIndicator({ events, hour }: TimeIndicatorProps) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  if (currentHour !== hour) return null;

  const minutePercentage = (currentMinute / 60) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top: `${minutePercentage}%` }}
    >
      <div className="relative flex items-center w-full">
        <div className="w-12 text-xs text-primary">
          {format(currentTime, "HH:mm", { locale: tr })}
        </div>
        <div className="flex-1 border-t border-primary" />
      </div>
    </motion.div>
  );
}