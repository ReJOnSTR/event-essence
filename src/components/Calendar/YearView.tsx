import { CalendarEvent } from "@/types/calendar";
import { format, addMonths, startOfYear } from "date-fns";
import { tr } from 'date-fns/locale';
import MonthView from "./MonthView";

interface YearViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export default function YearView({ date, events, onDateSelect }: YearViewProps) {
  const yearStart = startOfYear(date);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-2xl font-semibold mb-4">
        {format(date, "yyyy", { locale: tr })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((month) => (
          <div key={month.toString()} className="scale-[0.65] origin-top-left">
            <MonthView
              currentDate={month}
              events={events}
              onDateSelect={onDateSelect}
              isYearView={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}