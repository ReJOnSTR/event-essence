
import { CalendarEvent, Student } from "@/types/calendar";
import { format, addMonths, startOfYear } from "date-fns";
import { tr } from 'date-fns/locale';
import MonthView from "./MonthView";
import { motion } from "framer-motion";
import { useUserSettings } from "@/hooks/useUserSettings";

interface YearViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function YearView({ date, events, onDateSelect, onEventClick, students }: YearViewProps) {
  const yearStart = startOfYear(date);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));
  const { settings } = useUserSettings();

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-[900px]">
        {months.map((month, index) => (
          <motion.div
            key={month.toString()}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.25,
              delay: index * 0.02,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="bg-background/80 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-muted/80 py-2 px-3 border-b border-border">
              <h2 className="text-base font-semibold text-foreground text-center">
                {format(month, "MMMM", { locale: tr })}
              </h2>
            </div>
            <div className="p-2">
              <MonthView
                date={month}
                events={events}
                onDateSelect={onDateSelect}
                onEventClick={onEventClick}
                isYearView={true}
                students={students}
                settings={settings}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
