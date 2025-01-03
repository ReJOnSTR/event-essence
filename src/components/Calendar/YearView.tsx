import { CalendarEvent, Student } from "@/types/calendar";
import { format, addMonths, startOfYear } from "date-fns";
import { tr } from 'date-fns/locale';
import MonthView from "./MonthView";
import { motion } from "framer-motion";

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

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month, index) => (
          <motion.div
            key={month.toString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-gray-50 py-3 px-4 border-b">
              <h2 className="text-base font-semibold text-gray-900 text-center">
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
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}