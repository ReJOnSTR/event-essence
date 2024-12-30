import { CalendarEvent, Student } from "@/types/calendar";
import { format, addMonths, startOfYear, addYears, subYears } from "date-fns";
import { tr } from 'date-fns/locale';
import MonthView from "./MonthView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

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

  const nextYear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateSelect(addYears(date, 1));
  };
  
  const prevYear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateSelect(subYears(date, 1));
  };

  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateSelect(new Date());
  };

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-8">
        <div className="text-3xl font-bold text-gray-900">
          {format(date, "yyyy", { locale: tr })}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevYear}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={goToToday}
            className="flex gap-2 items-center"
          >
            <CalendarDays className="h-4 w-4" />
            Bugün
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextYear}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month) => (
          <div key={month.toString()} className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg font-semibold mb-2 text-center text-gray-700">
              {format(month, "MMMM", { locale: tr })}
            </div>
            <MonthView
              currentDate={month}
              events={events}
              onDateSelect={onDateSelect}
              onEventClick={onEventClick}
              isYearView={true}
              students={students}
            />
          </div>
        ))}
      </div>
    </div>
  );
}