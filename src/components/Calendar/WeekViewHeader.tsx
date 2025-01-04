import { format, isToday, addDays, startOfWeek } from "date-fns";
import { tr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { isHoliday } from "@/utils/turkishHolidays";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeekViewHeaderProps {
  date: Date;
}

export default function WeekViewHeader({ date }: WeekViewHeaderProps) {
  const isMobile = useIsMobile();
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-8 gap-px bg-gray-200">
      <div className="bg-white w-16" />
      {weekDays.map((day, index) => {
        const holiday = isHoliday(day);
        return (
          <motion.div
            key={day.toString()}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.25,
              delay: index * 0.02,
              ease: [0.23, 1, 0.32, 1]
            }}
            className={cn(
              "bg-white p-2 text-center",
              isToday(day) && "text-calendar-blue"
            )}
          >
            <div className="font-medium">
              {format(day, isMobile ? "EEE" : "EEEE", { locale: tr })}
            </div>
            <div className="text-sm text-gray-500">
              {format(day, "d MMM", { locale: tr })}
            </div>
            {holiday && (
              <div className="text-xs text-gray-500">
                {holiday.name}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}