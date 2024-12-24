import { CalendarEvent } from "@/types/calendar";
import { format, addMonths, startOfYear, addYears, subYears, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import MonthView from "./MonthView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export default function YearView({ date, events, onDateSelect }: YearViewProps) {
  const yearStart = startOfYear(date);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  const nextYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateSelect(addYears(date, 1));
  };
  
  const prevYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateSelect(subYears(date, 1));
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className={`text-2xl font-semibold ${isToday(date) ? 'text-blue-600' : ''}`}>
          {format(date, "yyyy", { locale: tr })}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevYear}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextYear}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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