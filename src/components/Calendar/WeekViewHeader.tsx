import { format, isToday, startOfWeek, addDays } from "date-fns";
import { tr } from 'date-fns/locale';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { isHoliday } from "@/utils/turkishHolidays";
import { useUserSettings } from "@/hooks/useUserSettings";
import DayStatusIcons from "./DayStatusIcons";

interface WeekViewHeaderProps {
  date: Date;
}

export default function WeekViewHeader({ date }: WeekViewHeaderProps) {
  const isMobile = useIsMobile();
  const { settings } = useUserSettings();
  const customHolidays = settings?.holidays || [];
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  const workingHours = settings?.working_hours;
  
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-8 gap-px bg-border">
      <div className="bg-background w-16 border-b border-border" />
      {weekDays.map((day, index) => {
        const holiday = isHoliday(day, customHolidays);
        const dayOfWeek = format(day, 'EEEE').toLowerCase();
        const daySettings = workingHours?.[dayOfWeek as keyof typeof workingHours];

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
              "bg-background p-2 text-center relative min-h-[60px] md:min-h-[80px] flex flex-col justify-between",
              "border-b border-border",
              isToday(day) && "text-[#1a73e8]"
            )}
          >
            <div>
              <div className="font-medium text-sm md:text-base">
                {format(day, isMobile ? "EEE" : "EEEE", { locale: tr })}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {format(day, "d MMM", { locale: tr })}
              </div>
            </div>

            <DayStatusIcons 
              isHoliday={holiday && !allowWorkOnHolidays}
              isWorkingHoliday={holiday && allowWorkOnHolidays}
              isNonWorkingDay={!daySettings?.enabled}
              holidayName={holiday?.name}
              className="static flex justify-center mt-1"
            />
          </motion.div>
        );
      })}
    </div>
  );
}