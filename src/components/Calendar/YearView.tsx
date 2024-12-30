import { CalendarEvent, Student } from "@/types/calendar";
import { format, addMonths, startOfYear, addYears, subYears } from "date-fns";
import { tr } from 'date-fns/locale';
import MonthView from "./MonthView";
import CalendarHeader from "./CalendarHeader";

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

  const nextYear = () => {
    onDateSelect(addYears(date, 1));
  };
  
  const prevYear = () => {
    onDateSelect(subYears(date, 1));
  };

  const goToToday = () => {
    onDateSelect(new Date());
  };

  return (
    <div className="w-full">
      <CalendarHeader
        date={date}
        onPrevious={prevYear}
        onNext={nextYear}
        onToday={goToToday}
        title={format(date, "yyyy", { locale: tr })}
      />
      
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