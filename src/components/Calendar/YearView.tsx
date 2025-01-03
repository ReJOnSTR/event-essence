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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.25,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  // Month card animation variants
  const monthVariants = {
    hidden: { 
      opacity: 0,
      y: 10,
      scale: 0.98
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {months.map((month, index) => (
          <motion.div
            key={month.toString()}
            variants={monthVariants}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="bg-gray-50 py-3 px-4 border-b">
              <h2 className="text-base font-semibold text-gray-900 text-center capitalize">
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
      </motion.div>
    </motion.div>
  );
}