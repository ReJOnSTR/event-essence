import { format, isToday, startOfWeek, addDays } from "date-fns";
import { tr } from 'date-fns/locale';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { isHoliday } from "@/utils/turkishHolidays";
import { useUserSettings } from "@/hooks/useUserSettings";

interface WeekViewHeaderProps {
  date: Date;
}

export default function WeekViewHeader({ date }: WeekViewHeaderProps) {
  const isMobile = useIsMobile();
  const { settings } = useUserSettings();
  const customHolidays = settings?.holidays || [];
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-8 gap-px bg-border">
      <div className="bg-background w-16 border-b border-border" />
      {weekDays.map((day, index) => {
        const holiday = isHoliday(day, customHolidays);
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
            {holiday && (
              <div 
                className={cn(
                  "text-[10px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-md",
                  !allowWorkOnHolidays 
                    ? "bg-destructive/10 text-destructive border border-destructive/20" 
                    : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
                  "truncate"
                )}
                title={holiday.name}
              >
                {holiday.name}
                {allowWorkOnHolidays && " (Çalışmaya Açık)"}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}